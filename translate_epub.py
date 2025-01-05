from ebooklib import epub
from bs4 import BeautifulSoup
import html
import os
import requests
import json
import time
from tqdm import tqdm
import sys
import argparse
from pathlib import Path

def deepseek_translate(text, style='balanced', domain='general', api_key=None, pbar=None):
    """
    使用Deepseek API进行翻译
    """
    if not api_key:
        raise ValueError("未配置API密钥，请在设置中配置API密钥")
        
    api_url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # 根据风格和领域调整提示词
    style_prompts = {
        'literal': '请严格按照原文进行直译，保持原文的结构和表达方式。',
        'free': '请采用意译的方式，使译文更符合中文的表达习惯，保持文字的优美流畅。',
        'balanced': '请在保持原意的基础上适当调整表达，使译文既准确又通顺。'
    }
    
    domain_prompts = {
        'general': '这是一般性文本',
        'technical': '这是一本技术文档，请确保专业术语的准确性',
        'literary': '这是一篇文学作品，请注意文学性和艺术性的表达',
        'business': '这是一本商业文档，请使用规范的商业用语',
        'academic': '这是一篇学术文章，请保持学术用语的严谨性'
    }
    
    prompt = f"""请将以下英文文本翻译成中文。要求：
1. {domain_prompts.get(domain, domain_prompts['general'])}
2. {style_prompts.get(style, style_prompts['balanced'])}
3. 如遇到专业术语，优先使用该领域的规范译法
4. 保持段落结构和格式

原文：
{text}

译文："""
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=data)
        result = response.json()
        translated_text = result['choices'][0]['message']['content']
        if pbar:
            pbar.set_description(f"最近翻译: {text[:30]}...")
        time.sleep(0.5)
        return translated_text.strip()
    except Exception as e:
        if pbar:
            pbar.set_description(f"翻译出错: {str(e)[:50]}")
        return text

def openai_translate(text, style='balanced', domain='general', api_key=None, pbar=None):
    """
    使用OpenAI API进行翻译
    """
    if not api_key:
        raise ValueError("未配置API密钥，请在设置中配置API密钥")
        
    api_url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # 根据风格和领域调整提示词
    style_prompts = {
        'literal': '请严格按照原文进行直译，保持原文的结构和表达方式。',
        'free': '请采用意译的方式，使译文更符合中文的表达习惯，保持文字的优美流畅。',
        'balanced': '请在保持原意的基础上适当调整表达，使译文既准确又通顺。'
    }
    
    domain_prompts = {
        'general': '这是一般性文本',
        'technical': '这是一本技术文档，请确保专业术语的准确性',
        'literary': '这是一篇文学作品，请注意文学性和艺术性的表达',
        'business': '这是一本商业文档，请使用规范的商业用语',
        'academic': '这是一篇学术文章，请保持学术用语的严谨性'
    }
    
    prompt = f"""请将以下英文文本翻译成中文。要求：
1. {domain_prompts.get(domain, domain_prompts['general'])}
2. {style_prompts.get(style, style_prompts['balanced'])}
3. 如遇到专业术语，优先使用该领域的规范译法
4. 保持段落结构和格式

原文：
{text}

译文："""
    
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=data)
        result = response.json()
        translated_text = result['choices'][0]['message']['content']
        if pbar:
            pbar.set_description(f"最近翻译: {text[:30]}...")
        time.sleep(0.5)
        return translated_text.strip()
    except Exception as e:
        if pbar:
            pbar.set_description(f"翻译出错: {str(e)[:50]}")
        return text

def google_translate(text, api_key=None, pbar=None):
    """
    使用Google Translate API进行翻译
    """
    if not api_key:
        raise ValueError("未配置API密钥，请在设置中配置API密钥")
        
    api_url = f"https://translation.googleapis.com/language/translate/v2?key={api_key}"
    
    data = {
        "q": text,
        "source": "en",
        "target": "zh-CN",
        "format": "text"
    }
    
    try:
        response = requests.post(api_url, json=data)
        result = response.json()
        translated_text = result['data']['translations'][0]['translatedText']
        if pbar:
            pbar.set_description(f"最近翻译: {text[:30]}...")
        return translated_text
    except Exception as e:
        if pbar:
            pbar.set_description(f"翻译出错: {str(e)[:50]}")
        return text

def translate_text(text, settings, pbar=None):
    """
    根据设置选择翻译API
    """
    api = settings.get('api', 'deepseek')
    api_key = settings.get('apiKeys', {}).get(api)
    style = settings.get('style', 'balanced')
    domain = settings.get('domain', 'general')
    
    if api == 'deepseek':
        return deepseek_translate(text, style, domain, api_key, pbar)
    elif api == 'openai':
        return openai_translate(text, style, domain, api_key, pbar)
    elif api == 'google':
        return google_translate(text, api_key, pbar)
    else:
        raise ValueError(f"不支持的翻译API: {api}")

def load_translation_progress(book_name):
    """
    加载翻译进度
    """
    progress_file = f"translation_progress_{book_name}.json"
    if os.path.exists(progress_file):
        with open(progress_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'chapters': {}, 'last_chapter': '', 'completed': False}

def save_translation_progress(progress, book_name):
    """
    保存翻译进度
    """
    progress_file = f"translation_progress_{book_name}.json"
    with open(progress_file, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def translate_content(content, chapter_name="", progress=None, book_name="", settings=None):
    """
    翻译HTML内容并保持原格式，支持断点续翻
    """
    soup = BeautifulSoup(content, 'html.parser')
    text_nodes = soup.find_all(text=True)
    
    # 获取该章节的翻译进度
    chapter_progress = progress['chapters'].get(chapter_name, {})
    translated_nodes = chapter_progress.get('translated_nodes', {})
    
    # 过滤出需要翻译的节点
    nodes_to_translate = [
        node for node in text_nodes 
        if node.strip() and node.parent.name not in ['script', 'style']
    ]
    
    print(f"\n开始翻译章节: {chapter_name}")
    with tqdm(total=len(nodes_to_translate), 
             desc="翻译进度",
             initial=len(translated_nodes),
             bar_format='{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]') as pbar:
        
        for i, node in enumerate(nodes_to_translate):
            node_key = str(i)
            if node_key in translated_nodes:
                # 如果该节点已翻译，直接使用缓存的翻译结果
                node.replace_with(translated_nodes[node_key])
                continue
                
            if node.strip():
                original_text = node.strip()
                try:
                    translated_text = translate_text(original_text, settings, pbar)
                    new_text = (f"{original_text}\n{translated_text}" 
                              if settings.get('keepOriginal', True) 
                              else translated_text)
                    node.replace_with(new_text)
                    
                    # 保存翻译结果
                    translated_nodes[node_key] = new_text
                    progress['chapters'][chapter_name] = {
                        'translated_nodes': translated_nodes,
                        'completed': False
                    }
                    save_translation_progress(progress, book_name)
                    
                    pbar.update(1)
                except Exception as e:
                    pbar.set_description(f"翻译出错: {str(e)[:50]}")
                    continue
    
    # 标记本章节翻译完成
    progress['chapters'][chapter_name]['completed'] = True
    save_translation_progress(progress, book_name)
    
    return str(soup)

def translate_epub(input_path, output_path, settings=None):
    """
    翻译整本epub并生成新文件，支持断点续翻
    """
    book_name = Path(input_path).stem
    progress = load_translation_progress(book_name)
    
    if progress.get('completed'):
        print(f"该书籍已完成翻译，直接使用缓存结果")
        return
    
    print(f"开始处理电子书: {os.path.basename(input_path)}")
    book = epub.read_epub(input_path)
    new_book = epub.EpubBook()
    
    try:
        identifiers = book.get_metadata('DC', 'identifier')
        if identifiers:
            new_book.set_identifier(identifiers[0][0])
        else:
            new_book.set_identifier('id123456')
            
        titles = book.get_metadata('DC', 'title')
        if titles:
            new_book.set_title(f"{titles[0][0]} (双语版)")
        else:
            new_book.set_title("Bilingual Book")
            
    except Exception as e:
        print(f"设置元数据时出错: {str(e)}")
        new_book.set_identifier('id123456')
        new_book.set_title("Bilingual Book")
    
    new_book.set_language('zh-CN')
    
    # 获取总章节数
    html_items = [item for item in book.get_items() if isinstance(item, epub.EpubHtml)]
    print(f"\n总章节数: {len(html_items)}")
    
    new_chapters = []
    for i, item in enumerate(html_items, 1):
        chapter_name = item.get_name()
        
        # 检查章节是否已完成翻译
        if chapter_name in progress['chapters'] and progress['chapters'][chapter_name].get('completed'):
            print(f"\n章节 {i}/{len(html_items)} ({chapter_name}) 已完成翻译，跳过")
            new_content = translate_content(
                item.get_content().decode('utf-8'),
                chapter_name,
                progress,
                book_name,
                settings
            )
        else:
            print(f"\n处理章节 {i}/{len(html_items)}")
            new_content = translate_content(
                item.get_content().decode('utf-8'),
                chapter_name,
                progress,
                book_name,
                settings
            )
        
        new_chapter = epub.EpubHtml(
            title=item.get_name(),
            file_name=item.get_name(),
            content=new_content.encode('utf-8')
        )
        new_chapters.append(new_chapter)
        new_book.add_item(new_chapter)
    
    # 复制其他资源
    for item in book.get_items():
        if not isinstance(item, epub.EpubHtml):
            new_book.add_item(item)
    
    new_book.toc = new_chapters
    new_book.spine = ['nav'] + new_chapters
    
    nav = epub.EpubNav()
    new_book.add_item(nav)
    
    nav_css = epub.EpubItem(
        uid="style_nav",
        file_name="style/nav.css",
        media_type="text/css",
        content=b'nav { display: block; }'
    )
    new_book.add_item(nav_css)
    
    # 标记整本书翻译完成
    progress['completed'] = True
    save_translation_progress(progress, book_name)
    
    print("\n正在保存翻译后的电子书...")
    epub.write_epub(output_path, new_book)
    print(f"翻译完成! 新文件保存在: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ePub双语翻译工具')
    parser.add_argument('input_file', help='输入文件路径')
    parser.add_argument('output_file', help='输出文件路径')
    parser.add_argument('--api', choices=['deepseek', 'openai', 'google'], default='deepseek', help='翻译API选择')
    parser.add_argument('--style', choices=['literal', 'free', 'balanced'], default='balanced', help='翻译风格')
    parser.add_argument('--domain', choices=['general', 'technical', 'literary', 'business', 'academic'], default='general', help='专业领域')
    parser.add_argument('--keep-original', action='store_true', help='保留英文原文')
    parser.add_argument('--no-keep-original', action='store_false', dest='keep_original', help='不保留英文原文')
    parser.set_defaults(keep_original=True)
    
    args = parser.parse_args()
    
    settings = {
        'api': args.api,
        'style': args.style,
        'domain': args.domain,
        'keepOriginal': args.keep_original
    }
    
    translate_epub(args.input_file, args.output_file, settings) 