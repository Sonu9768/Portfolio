import os
import requests
import random
import time
import urllib.parse
from google import genai
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()
LINKEDIN_ACCESS_TOKEN = os.environ.get("LINKEDIN_ACCESS_TOKEN")
LINKEDIN_PERSON_URN = os.environ.get("LINKEDIN_PERSON_URN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Configure Gemini
client = genai.Client(api_key=GEMINI_API_KEY)

BLOG_URL = "https://kumarsonu.com.np/blog/how-to-secure-home-network-nepal-2026.html"
BLOG_TITLE = "The Ultimate Guide to Securing Your Home Network in Nepal (2026 Edition)"

def generate_share_text():
    prompt = f"""
    Write a short, professional, and exciting LinkedIn post promoting my new blog article: "{BLOG_TITLE}".
    The post should mention that it's a 1200+ word comprehensive guide for home users in Nepal.
    Highlight topics like router security, IoT isolation, and preventing phishing.
    End the post with the link: {BLOG_URL}
    Include 3-5 relevant hashtags.
    Do not use any dash symbols (like -, –, or —) in the content.
    Do not wrap the response in quotes or markdown blocks.
    """
    try:
        print("[*] Generating LinkedIn post content with AI...")
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        text = response.text.strip().replace('–', '').replace('—', '')
        print("[+] Content generated.")
        return text
    except Exception as e:
        print(f"[-] Error generating content: {e}")
        return None

def fetch_ai_image(topic):
    print(f"[*] Generating AI image for: {topic}...")
    encoded_prompt = urllib.parse.quote(f"cybersecurity, home network, router, nepal, futuristic, 4k")
    seed = random.randint(1, 1000000)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=630&nologo=true&seed={seed}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            img_path = "super_blog_image.jpg"
            with open(img_path, "wb") as f:
                f.write(response.content)
            print("[+] Image downloaded.")
            return img_path
    except Exception as e:
        print(f"[-] Error fetching AI image: {e}")
    return None

def upload_image_to_linkedin(image_path):
    print("[*] Registering image upload with LinkedIn...")
    register_url = "https://api.linkedin.com/v2/assets?action=registerUpload"
    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    register_payload = {
        "registerUploadRequest": {
            "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
            "owner": LINKEDIN_PERSON_URN,
            "serviceRelationships": [{"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}]
        }
    }
    response = requests.post(register_url, json=register_payload, headers=headers)
    if response.status_code != 200: 
        print(f"[-] Register error: {response.text}")
        return None
    data = response.json()
    upload_url = data["value"]["uploadMechanism"]["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]["uploadUrl"]
    asset_urn = data["value"]["asset"]
    
    print("[*] Uploading image binary...")
    with open(image_path, "rb") as file:
        img_data = file.read()
    upload_headers = {"Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}", "Content-Type": "application/octet-stream"}
    upload_response = requests.post(upload_url, data=img_data, headers=upload_headers)
    if upload_response.status_code == 201:
        print("[+] Image uploaded.")
        return asset_urn
    else:
        print(f"[-] Upload error: {upload_response.text}")
        return None

def create_linkedin_post(text, asset_urn):
    print("[*] Creating final LinkedIn post...")
    url = "https://api.linkedin.com/v2/ugcPosts"
    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    payload = {
        "author": LINKEDIN_PERSON_URN,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "IMAGE" if asset_urn else "NONE",
                "media": [{"media": asset_urn, "status": "READY"}] if asset_urn else []
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.status_code == 201

if __name__ == "__main__":
    text = generate_share_text()
    if text:
        img_path = fetch_ai_image("home network security nepal")
        asset_urn = upload_image_to_linkedin(img_path) if img_path else None
        if create_linkedin_post(text, asset_urn):
            print("[+++] SUCCESS: Blog post shared on LinkedIn!")
        else:
            print("[-] FAILED to post on LinkedIn.")
        if img_path and os.path.exists(img_path):
            os.remove(img_path)
