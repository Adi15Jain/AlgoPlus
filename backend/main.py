from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
from typing import Any

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
class StackRequest(BaseModel):
    operation: str     
    value: int | None = None 


@app.post("/sorting")
def run_sorting(req: sortingRequest):
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
def run_search(req: SearchRequest):
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

# Global stack state for stack operations
STACK_STATE: list[int] = []

@app.post("/stack")
def run_stack(req: StackRequest):
    global STACK_STATE

    try:
        payload: dict[str, Any] = {
            "operation": req.operation,
            "stack": STACK_STATE   # 👈 send current state
        }

        if req.operation == "push":
            if req.value is None:
                raise HTTPException(400, "Value required")
            payload["value"] = req.value

        process = subprocess.run(
            ["../engine/stacks/stack"],
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            check=True
        )

        result = json.loads(process.stdout)

        # Update backend stack from engine output
        STACK_STATE = result["steps"][-1]["array"]

        return result

    except Exception as e:
        raise HTTPException(500, str(e))
