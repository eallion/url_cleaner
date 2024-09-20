const defaultWhitelist = [
  'github.com',
  '*.1688.com',
  '*.aliyun.com',
  '*.baidu.com',
  '*.bing.com',
  '*.bilibili.com',
  '*.fliggy.com',
  '*.google.com',
  '*.jd.com',
  '*.jd.hk',
  '*.so.com',
  '*.taobao.com',
  '*.tmall.com',
  '*.tmall.hk',
  '*.yandex.com',
  'b23.tv',
  'cloud.tencent.com'
];

document.addEventListener('DOMContentLoaded', function () {
  const whitelistTextArea = document.getElementById('whitelist');
  const saveButton = document.getElementById('save');
  const resetButton = document.getElementById('reset');
  const message = document.getElementById('message');
  // i18n
  document.getElementById('options_title').innerHTML = chrome.i18n.getMessage('options_title');
  document.getElementById('options_title_h1').innerHTML = chrome.i18n.getMessage('options_title_h1');
  document.getElementById('options_desc_p1').innerHTML = chrome.i18n.getMessage('options_desc_p1');
  document.getElementById('options_desc_p2').innerHTML = chrome.i18n.getMessage('options_desc_p2');
  saveButton.textContent = chrome.i18n.getMessage('options_button_saved');
  resetButton.textContent = chrome.i18n.getMessage('options_button_reset');

  // 加载白名单
  chrome.storage.sync.get('whitelist', function (data) {
      if (data.whitelist) {
          whitelistTextArea.value = data.whitelist.join('\n');
      } else {
          whitelistTextArea.value = defaultWhitelist.join('\n');
      }
  });

  // 保存白名单
  saveButton.addEventListener('click', function () {
      const whitelist = whitelistTextArea.value.split('\n').map(domain => domain.trim()).filter(domain => domain);
      chrome.storage.sync.set({ whitelist: whitelist }, function () {
          message.innerHTML = chrome.i18n.getMessage('options_message_saved');
      });
  });

  // 重置为默认白名单
  resetButton.addEventListener('click', function () {
      chrome.storage.sync.set({ whitelist: defaultWhitelist }, function () {
          whitelistTextArea.value = defaultWhitelist.join('\n');
          message.innerHTML = chrome.i18n.getMessage('options_message_reset');
      });
  });
});
