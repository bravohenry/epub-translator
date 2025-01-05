import os
import json

print('环境变量测试:')
print(json.dumps({
    'TRANSLATOR_API_KEY': os.environ.get('TRANSLATOR_API_KEY', '未设置'),
    'TRANSLATOR_TARGET_LANG': os.environ.get('TRANSLATOR_TARGET_LANG', '未设置'),
    'PATH': os.environ.get('PATH', '未设置')
}, ensure_ascii=False, indent=2)) 