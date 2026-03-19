from langchain_community.llms import Ollama
import os

# Models
planner_llm = Ollama(model="llama3:8b")
coder_llm = Ollama(model="codellama:7b")
reviewer_llm = Ollama(model="mistral")

# Step 1: Planning
def plan(task):
    prompt = f"""
You are a senior software architect.

Break this task into clear steps:
{task}
"""
    return planner_llm.invoke(prompt)

# Step 2: Coding
def code(plan_output):
    prompt = f"""
You are an expert developer.

Write COMPLETE working code based on this plan:
{plan_output}

Return only code.
"""
    return coder_llm.invoke(prompt)

# Step 3: Review
def review(code_output):
    prompt = f"""
You are a strict code reviewer.

Improve this code, fix issues, optimize it:
{code_output}

Return final improved code only.
"""
    return reviewer_llm.invoke(prompt)

# Step 4: Save to file
def save(code_output, filename="output.js"):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(code_output)

# MAIN EXECUTION
if __name__ == "__main__":
    task = input("Enter your task: ")

    print("\n🧠 Planning...")
    plan_output = plan(task)
    print(plan_output)

    print("\n💻 Coding...")
    code_output = code(plan_output)

    print("\n🔍 Reviewing...")
    final_code = review(code_output)

    print("\n💾 Saving file...")
    save(final_code)

    print("\n✅ Done! Code saved as output.js")