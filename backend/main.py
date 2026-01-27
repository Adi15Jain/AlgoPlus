from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
from typing import Any, List, Optional

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
class QueueRequest(BaseModel):
    operation: str           
    value: int | None = None  
class TreeRequest(BaseModel):
    operation: str                 # build | traversal | search
    build_type: Optional[str] = None
    algorithm: Optional[str] = None
    values: Optional[List[str]] = None
    target: Optional[int] = None


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


QUEUE_STATE: list[int] = []

@app.post("/queue")
def run_queue(req: QueueRequest):
    global QUEUE_STATE

    try:
        payload: dict[str, Any] = {
            "operation": req.operation,
            "queue": QUEUE_STATE
        }

        if req.operation == "enqueue":
            if req.value is None:
                raise HTTPException(
                    status_code=400,
                    detail="Value required for enqueue operation"
                )
            payload["value"] = req.value

        process = subprocess.run(
            ["../engine/queues/queue"],
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            check=True
        )

        result = json.loads(process.stdout)

        # Update backend queue state
        QUEUE_STATE = result["steps"][-1]["array"]

        return result

    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="C++ queue engine error")

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON from queue engine")

TREE_STATE: list[str] = []

@app.post("/tree")
def run_tree(req: TreeRequest):
    global TREE_STATE

    try:
        payload: dict = {
            "operation": req.operation
        }

        # BUILD
        if req.operation == "build":
            if not req.build_type or not req.values:
                raise HTTPException(
                    status_code=400,
                    detail="build_type and values required for build"
                )

            payload["build_type"] = req.build_type
            payload["values"] = req.values

        # TRAVERSAL
        elif req.operation == "traversal":
            if not TREE_STATE:
                raise HTTPException(
                    status_code=400,
                    detail="Tree not built yet"
        )
        elif req.operation == "traversal":
            if not req.algorithm:
                raise HTTPException(
                    status_code=400,
                    detail="algorithm required for traversal"
                )

            payload["algorithm"] = req.algorithm
            payload["values"] = TREE_STATE

        # SEARCH
        elif req.operation == "traversal":
            if not TREE_STATE:
                raise HTTPException(
                    status_code=400,
                    detail="Tree not built yet"
                )
        elif req.operation == "search":
            if req.target is None:
                raise HTTPException(
                    status_code=400,
                    detail="target required for search"
                )

            payload["target"] = req.target
            payload["values"] = TREE_STATE

        else:
            raise HTTPException(status_code=400, detail="Invalid tree operation")

        process = subprocess.run(
            ["../engine/trees/tree"],
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            check=True
        )

        result = json.loads(process.stdout)

        # Update tree state after build
        if req.operation == "build":
            TREE_STATE = result["steps"][0]["tree"]

        return result

    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="Tree engine error")

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON from tree engine")
