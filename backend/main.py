from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class sortingRequest(BaseModel):
    algorithm: str
    array: list[int]
class SearchRequest(BaseModel):
    algorithm: str
    array: list[int]
    target: int


@app.post("/sorting")
def run_algorithm(req: sortingRequest):
    try:
        # Serialize request JSON
        input_json = json.dumps(req.model_dump())

        # Run C++ engine
        process = subprocess.run(
            ["../engine/sorting/sorting"],
            input=input_json,
            text=True,
            capture_output=True,
            check=True
        )

        # Parse C++ output
        output = json.loads(process.stdout)
        return output

    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail="C++ engine error")

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON from C++")


@app.post("/searching")
def run_search_algorithm(req: SearchRequest):
    try:
        # Serialize request JSON
        input_json = json.dumps(req.model_dump())

        # Run C++ search engine
        process = subprocess.run(
            ["../engine/searching/searching"],
            input=input_json,
            text=True,
            capture_output=True,
            check=True
        )

        # Parse C++ output
        output = json.loads(process.stdout)
        return output

    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="C++ search engine error")

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON from C++ search engine")
