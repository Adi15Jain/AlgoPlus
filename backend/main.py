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


class AlgoRequest(BaseModel):
    algorithm: str
    array: list[int]

@app.post("/sorting-bubblesort")
def run_algorithm(req: AlgoRequest):
    try:
        # Serialize request JSON
        input_json = json.dumps(req.model_dump())

        # Run C++ engine
        process = subprocess.run(
            ["../engine/sorting/bubble"],
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

