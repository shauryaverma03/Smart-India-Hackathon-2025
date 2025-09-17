from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_analyser import (
    configure_genai,
    get_gemini_response,
    extract_pdf_text,
    prepare_prompt
)
import os

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

@app.route("/api/analyse_resume", methods=["POST"])
def analyse_resume():
    try:
        configure_genai(GOOGLE_API_KEY)
        resume_file = request.files["resume"]
        job_description = request.form["job_description"]
        resume_text = extract_pdf_text(resume_file)
        prompt = prepare_prompt(resume_text, job_description)
        result = get_gemini_response(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)