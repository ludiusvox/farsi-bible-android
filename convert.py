import json
import os
import re

def normalize_persian(text):
    if not isinstance(text, str):
        return text
    text = text.replace('ي', 'ی').replace('ك', 'ک')
    text = re.sub(r'[\u064B-\u065F\u0670]', '', text)
    replacements = {
        "امثال سلیمان": "امثال",
        "غزل غزلهای سلیمان": "غزل غزل‌ها",
        "غزل غزلها": "غزل غزل‌ها",
        "مراقی ارمیا": "مراثی",
        "مراثی ارمیا": "مراثی",
        "مکاشفۀ یوحنا": "مکاشفه",
        "مکاشفه یوحنا": "مکاشفه",
    }
    text = text.replace('ۀ', 'ه').replace('ة', 'ه')
    for old, new in replacements.items():
        if old in text:
            text = new
    text = text.replace('\u200c', ' ')
    text = text.strip()
    return re.sub(r'\s+', ' ', text)

def split_bible_json(input_file, output_folder):
    # Primary display names for the metadata file
    primary_names = {
        "gen": "پیدایش", "exo": "خروج", "lev": "لاویان", "num": "اعداد", "deu": "تثنیه",
        "jos": "یشوع", "jdg": "داوران", "rut": "روت", "1sa": "اول سموئیل", "2sa": "دوم سموئیل",
        "1ki": "اول پادشاهان", "2ki": "دوم پادشاهان", "1ch": "اول تواریخ", "2ch": "دوم تواریخ",
        "ezr": "عزرا", "neh": "نحمیا", "est": "استر", "job": "ایوب", "psa": "مزامیر",
        "pro": "امثال", "ecc": "جامعه", "sng": "غزل غزل‌ها", "isa": "اشعیا", "jer": "ارمیا",
        "lam": "مراثی", "ezk": "حزقیال", "dan": "دانیال", "hos": "هوشع", "jol": "یوئیل",
        "amo": "عاموس", "oba": "عوبدیا", "jon": "یونس", "mic": "میکاه", "nam": "ناحوم",
        "hab": "حبقوق", "zep": "صفنیا", "hag": "حجی", "zec": "زکریا", "mal": "ملاکی",
        "mat": "متی", "mrk": "مرقس", "luk": "لوقا", "jhn": "یوحنا", "act": "اعمال رسولان",
        "rom": "رومیان", "1co": "اول قرنتیان", "2co": "دوم قرنتیان", "gal": "غلاتیان",
        "eph": "افسسیان", "php": "فیلیپیان", "col": "کولسیان", "1th": "اول تسالونیکیان",
        "2th": "دوم تسالونیکیان", "1ti": "اول تیموتائوس", "2ti": "دوم تیموتائوس", "tit": "تیتوس",
        "phm": "فلیمون", "heb": "عبرانیان", "jas": "یعقوب", "1pe": "اول پطرس", "2pe": "دوم پطرس",
        "1jn": "اول یوحنا", "2jn": "دوم یوحنا", "3jn": "سوم یوحنا", "jud": "یهودا", "rev": "مکاشفه"
    }

    # Mapping for matching logic
    raw_map = {
        "پیدایش": "gen", "خروج": "exo", "لاویان": "lev", "اعداد": "num", "تثنیه": "deu",
        "یشوع": "jos", "یوشع": "jos", "داوران": "jdg", "روت": "rut", 
        "اول سموئیل": "1sa", "دوم سموئیل": "2sa", "اول پادشاهان": "1ki", "دوم پادشاهان": "2ki", 
        "اول تواریخ": "1ch", "دوم تواریخ": "2ch", "عزرا": "ezr", "نحمیا": "neh", "استر": "est", 
        "ایوب": "job", "مزامیر": "psa", "امثال": "pro", "جامعه": "ecc", "غزل غزل‌ها": "sng", 
        "اشعیا": "isa", "ارمیا": "jer", "مراثی": "lam", "حزقیال": "ezk", "دانیال": "dan", 
        "هوشع": "hos", "یوئیل": "jol", "عاموس": "amo", "عوبدیا": "oba", "یونس": "jon", 
        "میکاه": "mic", "ناحوم": "nam", "حبقوق": "hab", "صفنیا": "zep", "حجی": "hag", 
        "زکریا": "zec", "ملاکی": "mal", "متی": "mat", "مرقس": "mrk", "لوقا": "luk", 
        "یوحنا": "jhn", "اعمال رسولان": "act", "رومیان": "rom", "اول قرنتیان": "1co", 
        "دوم قرنتیان": "2co", "غلاتیان": "gal", "غلاطیان": "gal", "افسسیان": "eph", 
        "فیلیپیان": "php", "کولسیان": "col", "اول تسالونیکیان": "1th", "دوم تسالونیکیان": "2th", 
        "اول تیموتائوس": "1ti", "دوم تیموتائوس": "2ti", "تیتوس": "tit", "تیطس": "tit", 
        "فلیمون": "phm", "فیلیمون": "phm", "عبرانیان": "heb", "یعقوب": "jas", 
        "اول پطرس": "1pe", "دوم پطرس": "2pe", "اول یوحنا": "1jn", "دوم یوحنا": "2jn", 
        "سوم یوحنا": "3jn", "یهودا": "jud", "مکاشفه": "rev"
    }

    master_ids = list(primary_names.keys())
    name_to_id = {normalize_persian(k): v for k, v in raw_map.items()}

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    try:
        print("Loading master JSON...")
        with open(input_file, 'r', encoding='utf-8') as f:
            bible_data = json.load(f)

        verses_list = bible_data.get('verses', [])
        books_data = {}
        unmapped_names = set()

        for verse_obj in verses_list:
            raw_name = str(verse_obj.get('book_name', ''))
            b_name = normalize_persian(raw_name)
            b_id = name_to_id.get(b_name)
            
            if not b_id:
                for key, val in name_to_id.items():
                    if key in b_name or b_name in key:
                        b_id = val
                        break
                if not b_id:
                    unmapped_names.add(raw_name)
                    continue

            c_num = str(verse_obj.get('chapter'))
            v_num = str(verse_obj.get('verse'))
            text = verse_obj.get('text')

            if b_id not in books_data:
                books_data[b_id] = {}
            if c_num not in books_data[b_id]:
                books_data[b_id][c_num] = {}
            
            books_data[b_id][c_num][v_num] = text

        # 1. Save individual book files
        for b_id, content in books_data.items():
            file_path = os.path.join(output_folder, f"{b_id}.json")
            with open(file_path, 'w', encoding='utf-8') as out_file:
                json.dump(content, out_file, ensure_ascii=False, indent=2)

        # 2. Generate and save matching metadata.json
        metadata = []
        # In the Protestant Bible, the first 39 books are OT, the last 27 are NT.
        ot_count = 39 

        for index, b_id in enumerate(master_ids):
            if b_id in books_data:
                chapters_in_book = len(books_data[b_id])
                testament = "OT" if index < ot_count else "NT"
                
                metadata.append({
                    "id": b_id,
                    "name": primary_names[b_id],
                    "testament": testament,
                    "chapters": chapters_in_book
                })

        metadata_path = os.path.join(output_folder, "metadata.json")
        with open(metadata_path, 'w', encoding='utf-8') as meta_file:
            json.dump(metadata, meta_file, ensure_ascii=False, indent=2)

        # DIAGNOSTICS
        created_ids = set(books_data.keys())
        missing_ids = [m for m in master_ids if m not in created_ids]

        print("-" * 40)
        if not missing_ids:
            print("💎 Success! All 66 books and metadata.json created perfectly.")
        else:
            print(f"⚠️ Missing {len(missing_ids)} books: {missing_ids}")
        
        print(f"✅ Created {len(books_data)} book files in {output_folder}")
        print(f"✅ Created metadata.json with {len(metadata)} entries")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    split_bible_json('old_persian_bible.json', 'public/data/bible')