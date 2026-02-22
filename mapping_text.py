import json

def inspect_json(input_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print("--- JSON Structure Detective ---")
        print(f"Top-level keys: {list(data.keys())}")

        for key, value in data.items():
            print(f"\n🔑 Key: '{key}'")
            print(f"   Type: {type(value).__name__}")
            
            if isinstance(value, list):
                print(f"   Length: {len(value)} items")
                if len(value) > 0 and isinstance(value[0], dict):
                    print(f"   Keys inside the first item: {list(value[0].keys())}")
            elif isinstance(value, dict):
                print(f"   Length: {len(value)} items")
                print(f"   First few keys: {list(value.keys())[:5]}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_json('old_persian_bible.json')