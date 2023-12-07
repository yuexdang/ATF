import os
import json

class JsonHandle:
    def __init__(self, conf) -> None:
        self.abs_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.conf_path = os.path.join(self.abs_path, conf)

        self.dataHash = {}

        self.read_conf()

    def transUrl(self, url, Tmode=True):
        url = url.replace(" ", "|") if Tmode else url.replace("|", " ")
        return url
    
    def __getABSPath(self, _absPath, _folder_path):
        url = _folder_path if os.path.isabs(_folder_path) else os.path.join(_absPath, _folder_path)
        return url


    def read_conf(self):
        with open(self.conf_path, 'r', encoding='utf-8') as f:
            config = json.load(f)

        self.dataHash["answerList"] = config.get('answerList', {})
        self.dataHash["folder_path"] = self. __getABSPath(self.abs_path, config.get('folder_path', 'static\\pictures'))
        self.dataHash["waitTime"]  = config.get('waitTime', 1)
        self.dataHash["data_path"]  = self. __getABSPath(self.abs_path, config.get('data_path', 'data'))
        self.dataHash["file_name"]  = config.get('file_name', 'data.xlsx')
        self.dataHash["length"]  = config.get('length', '203')
        self.dataHash["width"] = config.get('width', '80')
        self.dataHash["showData"] = config.get('showData', "1")
        self.dataHash["coordinates"]  = config.get('coordinates', '{}')

    def write_conf(self, _old, _new):
        with open(self.conf_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        if "_path" in _old:
            _new = self.transUrl(_new, Tmode=False)

        config[_old] = _new
        self.dataHash[_old] = _new

        with open(self.conf_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=4)



