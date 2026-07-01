# PlaceNet

**PlaceNet** is an AI-powered placement and recruitment platform that helps Training & Placement Offices (TPOs) and recruiters efficiently manage large volumes of resumes. The system automatically parses resumes, stores candidate information, creates a searchable knowledge base, and uses Retrieval-Augmented Generation (RAG) to understand recruiter requirements and identify the most relevant candidates. By combining resume intelligence, semantic search, candidate ranking, and an AI chat assistant, PlaceNet enables users to quickly discover, shortlist, and export the best-matching candidates from thousands of applications through a simple and intuitive interface.

# Project Architecture
 ```
 placenet/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── types/
│   ├── styles/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── resume.py
│   │   │   │   ├── candidate.py
│   │   │   │   ├── search.py
│   │   │   │   └── chat.py
│   │   │   └── router.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── logging.py
│   │   │
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   ├── models.py
│   │   │   └── migrations/
│   │   │
│   │   ├── schemas/
│   │   │   ├── resume.py
│   │   │   ├── candidate.py
│   │   │   └── search.py
│   │   │
│   │   ├── services/
│   │   │   ├── resume_service.py
│   │   │   ├── candidate_service.py
│   │   │   ├── search_service.py
│   │   │   └── chat_service.py
│   │   │
│   │   ├── utils/
│   │   │   ├── file_handler.py
│   │   │   └── helpers.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── ai/
│   ├── prompts/
│   │   ├── system.md
│   │   ├── resume_parser.md
│   │   ├── recruiter_chat.md
│   │   └── candidate_ranking.md
│   │
│   ├── parsing/
│   │   ├── parser.py
│   │   └── extractor.py
│   │
│   ├── embeddings/
│   │   ├── embedding_model.py
│   │   └── generator.py
│   │
│   ├── vectorstore/
│   │   ├── chromadb.py
│   │   └── indexing.py
│   │
│   ├── rag/
│   │   ├── retriever.py
│   │   ├── pipeline.py
│   │   └── generator.py
│   │
│   ├── ranking/
│   │   └── scorer.py
│   │
│   └── evaluation/
│       ├── test_cases/
│       └── results/
│
├── data/
│   ├── raw/
│   ├── processed/
│   ├── embeddings/
│   ├── exports/
│   └── samples/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── rag.md
│   └── roadmap.md
│
├── scripts/
│   ├── ingest_resumes.py
│   ├── generate_embeddings.py
│   ├── seed_database.py
│   └── reset_database.py
│
├── tests/
│   ├── backend/
│   ├── ai/
│   └── api/
│
├── .gitignore
├── .env.example
├── docker-compose.yml
└── README.md
```

# Installation

```bash
git clone -b testing2 https://github.com/drishtiisharma/PlaceNet.git
cd PlaceNet/frontend
npm install
npm run dev
````

Open your browser and visit:

```
http://localhost:3000
```

# Status

This project is actively being developed, with additional features and improvements planned.
