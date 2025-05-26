import pandas as pd
import requests
from typing import List
import time
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.base import Embeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI


class LocalServerEmbeddings(Embeddings):
    """
    Embeddings client wrapping a local LM Studio server.
    """
    def __init__(self, base_url: str, model: str = "text-embedding-nomic-embed-text-v1.5"):
        self.base_url = base_url
        self.model = model
        self._dim = None  # will infer on first embed

    def _infer_dim(self):
        # Embed a short test string to get dimension
        resp = requests.post(
            f"{self.base_url}/embeddings",
            json={"model": self.model, "input": [""]},
        )
        resp.raise_for_status()
        emb = resp.json()["data"][0]["embedding"]
        self._dim = len(emb)
        return self._dim

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Attempt to batch-embed in chunks with fallback and error checking.
        """
        embeddings: List[List[float]] = []
        batch_size = 100
        for i in range(0, len(texts), batch_size):
            print(i)
            batch = texts[i : i + batch_size]
            payload = {"model": self.model, "input": batch}
            try:
                resp = requests.post(f"{self.base_url}/embeddings", json=payload)
                resp.raise_for_status()
                batch_embs = [item["embedding"] for item in resp.json()["data"]]
            except Exception as batch_err:
                print(f"❌ Batch embedding failed for items {i}-{i+len(batch)-1}: {batch_err}")
                # Fallback: embed individually
                batch_embs = []
                for j, text in enumerate(batch):
                    try:
                        emb = self.embed_query(text)
                    except Exception as e:
                        print(f"❌ Embedding failed for chunk {i+j}: {e}")
                        if self._dim is None:
                            self._infer_dim()
                        emb = [0.0] * self._dim
                    batch_embs.append(emb)
            embeddings.extend(batch_embs)
            time.sleep(0.1)  # avoid overwhelming the server
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        payload = {"model": self.model, "input": [text]}
        resp = requests.post(f"{self.base_url}/embeddings", json=payload)
        resp.raise_for_status()
        return resp.json()["data"][0]["embedding"]


def load_recipes(csv_path: str) -> List[Document]:
    """
    Load CSV of recipes and convert each row into a LangChain Document.
    Assumes columns: title, ingredients, tags
    """
    df = pd.read_csv(csv_path)
    docs: List[Document] = []
    df = df.dropna(subset=['name'])
    for _, row in df.iterrows():
        content = (
            f"Name: {row['name']}\n\n"
            f"Ingredients:\n{row['ingredients']}\n\n"
            f"Tags:\n{row['tags']}"
        )
        docs.append(Document(page_content=content, metadata={"title": row['name']}))
    return docs


def split_documents(
    docs: List[Document], chunk_size: int = 1000, chunk_overlap: int = 100
) -> List[Document]:
    """
    Split Documents into smaller overlapping chunks.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    return splitter.split_documents(docs)


def build_vectordb(
    docs: List[Document], persist_directory: str, embedding: Embeddings
) -> Chroma:
    """
    Create and persist a Chroma vector store from documents.
    """
    vectordb = Chroma.from_documents(
        documents=docs,
        embedding=embedding,
        persist_directory=persist_directory,
    )
    return vectordb


def load_vectordb(
    persist_directory: str, embedding: Embeddings
) -> Chroma:
    """
    Load an existing Chroma vector store.
    """
    return Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding,
    )


def get_qa_chain(llm: ChatOpenAI, vectordb: Chroma) -> RetrievalQA:
    """
    Build a RetrievalQA chain with source docs returned.
    """
    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectordb.as_retriever(k=30),
        return_source_documents=True,
    )

# csv_path = "./data/RAW_recipes.csv"
# persist_dir = "chroma_recipes/"
# embedding_server = "http://localhost:1234/v1"

# recipes = load_recipes(csv_path)[:20000]
# chunks = split_documents(recipes)
# print(f"Created {len(chunks)} chunks.")

# embedding = LocalServerEmbeddings(base_url=embedding_server)
# print("Building vector store (this may take a while)...")
# vectordb = build_vectordb(chunks, persist_dir, embedding)
# print("Finished building vector store")