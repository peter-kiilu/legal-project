"""
Simple test script for Legal Sage AI Backend endpoints.
Run with: python test_endpoints.py
"""
import requests
import os

BASE_URL = "http://127.0.0.1:8000"
TEST_PDF = "LEGAL ANALYSIS AND FRAMEWORK ON HUMAN TRAFFICKING.pdf"

def test_root():
    """Test the root endpoint."""
    print("\n=== Testing Root Endpoint ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_upload():
    """Test document upload."""
    print("\n=== Testing Upload Endpoint ===")
    
    if not os.path.exists(TEST_PDF):
        print(f"ERROR: Test file '{TEST_PDF}' not found!")
        return False
    
    with open(TEST_PDF, "rb") as f:
        files = {"file": (TEST_PDF, f, "application/pdf")}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_analyze():
    """Test document analysis/summary."""
    print("\n=== Testing Analyze Endpoint ===")
    
    response = requests.post(
        f"{BASE_URL}/analyze",
        params={"filename": TEST_PDF}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        summary = response.json().get("summary", "")
        print(f"Summary (first 500 chars): {summary[:500]}...")
    else:
        print(f"Response: {response.json()}")
    return response.status_code == 200

def test_predict():
    """Test case prediction."""
    print("\n=== Testing Predict Endpoint ===")
    
    case_details = """
    A victim was trafficked from rural Kenya to Nairobi under false promises of employment.
    The traffickers confiscated her documents and forced her into domestic servitude.
    She escaped after 6 months and reported to police.
    """
    
    response = requests.post(
        f"{BASE_URL}/predict",
        json={"case_details": case_details}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        prediction = response.json().get("prediction", "")
        print(f"Prediction (first 500 chars): {prediction[:500]}...")
    else:
        print(f"Response: {response.json()}")
    return response.status_code == 200

def test_chat():
    """Test chat with documents."""
    print("\n=== Testing Chat Endpoint ===")
    
    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "query": "What are the main legal frameworks for combating human trafficking in Kenya?",
            "history": []
        }
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        answer = response.json().get("response", "")
        print(f"Answer (first 500 chars): {answer[:500]}...")
    else:
        print(f"Response: {response.json()}")
    return response.status_code == 200

if __name__ == "__main__":
    print("=" * 50)
    print("Legal Sage AI - Backend Endpoint Tests")
    print("=" * 50)
    
    results = {
        "Root": test_root(),
        "Upload": test_upload(),
        "Analyze": test_analyze(),
        "Predict": test_predict(),
        "Chat": test_chat(),
    }
    
    print("\n" + "=" * 50)
    print("TEST RESULTS")
    print("=" * 50)
    for name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{name}: {status}")
