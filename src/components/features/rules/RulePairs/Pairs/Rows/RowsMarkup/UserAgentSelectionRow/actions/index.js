export const getAvailableUserAgents = (pair) => {
  switch (pair.envType) {
    case "device":
      return [
        {
          label: "Android",
          options: [
            {
              label: "Android Phone",
              value: {
                env: "andoid.phone",
                userAgent:
                  "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36",
              },
            },
            {
              label: "Android Tablet",
              value: {
                env: "andoid.tablet",
                userAgent:
                  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
              },
            },
          ],
        },
        {
          label: "Apple",
          options: [
            {
              label: "Apple iPhone",
              value: {
                env: "apple.iphone",
                userAgent:
                  "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
              },
            },
            {
              label: "Apple iPad",
              value: {
                env: "apple.ipad",
                userAgent:
                  "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
              },
            },
          ],
        },
        {
          label: "Windows",
          options: [
            {
              label: "Windows Phone",
              value: {
                env: "windows.phone",
                userAgent:
                  "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)",
              },
            },
            {
              label: "Windows Tablet",
              value: {
                env: "windows.tablet",
                userAgent:
                  "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; Touch; NOKIA; Lumia 920)",
              },
            },
          ],
        },
        {
          label: "Blackberry",
          options: [
            {
              label: "Blackberry Phone",
              value: {
                env: "blackberry.phone",
                userAgent:
                  "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.0.0.187 Mobile Safari/534.11",
              },
            },
            {
              label: "Blackberry Tablet",
              value: {
                env: "blackberry.tablet",
                userAgent:
                  "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.0.0; en-US) AppleWebKit/535.8 (KHTML, like Gecko) Version/7.2.0.0 Safari/535.8",
              },
            },
          ],
        },
        {
          label: "Symbian",
          options: [
            {
              label: "Symbian Phone",
              value: {
                env: "symbian_phone",
                userAgent:
                  "Mozilla/5.0 (SymbianOS) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.1.33 Mobile Safari/533.4 3gpp-gba",
              },
            },
          ],
        },
      ];
    case "browser":
      return [
        {
          label: "Google Chrome",
          options: [
            {
              label: "Chrome on Windows",
              value: {
                env: "chrome.windows",
                userAgent:
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
              },
            },
            {
              label: "Chrome on Macintosh",
              value: {
                env: "chrome.macintosh",
                userAgent:
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
              },
            },
            {
              label: "Chrome on Linux",
              value: {
                env: "chrome.linux",
                userAgent:
                  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
              },
            },
          ],
        },
        {
          label: "Mozilla Firefox",
          options: [
            {
              label: "Firefox on Windows",
              value: {
                env: "firefox.windows",
                userAgent:
                  "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0",
              },
            },
            {
              label: "Firfox on Macintosh",
              value: {
                env: "firefox.macintosh",
                userAgent:
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:52.0) Gecko/20100101 Firefox/52.0",
              },
            },
            {
              label: "Firfox on Linux",
              value: {
                env: "firefox.linux",
                userAgent:
                  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0",
              },
            },
          ],
        },
        {
          label: "Safari",
          options: [
            {
              label: "Safari",
              value: {
                env: "safari",
                userAgent:
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8",
              },
            },
          ],
        },
        {
          label: "Microsoft Internet Explorer",
          options: [
            {
              label: "Internet Explorer 6",
              value: {
                env: "msie.msie6",
                userAgent: "Mozilla/4.0(compatible; MSIE 6.0; Windows NT 5.1)",
              },
            },
            {
              label: "Internet Explorer 7",
              value: {
                env: "msie.msie7",
                userAgent: "Mozilla/4.0(compatible; MSIE 7.0; Windows NT 6.0)",
              },
            },
            {
              label: "Internet Explorer 8",
              value: {
                env: "msie.msie8",
                userAgent:
                  "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
              },
            },
            {
              label: "Internet Explorer 9",
              value: {
                env: "msie.msie9",
                userAgent:
                  "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
              },
            },
            {
              label: "Internet Explorer 10",
              value: {
                env: "msie.msie10",
                userAgent:
                  "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
              },
            },
            {
              label: "Internet Explorer 11",
              value: {
                env: "msie.msie11",
                userAgent:
                  "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
              },
            },
          ],
        },
        {
          label: "Microsoft Edge",
          options: [
            {
              label: "Microsoft Edge",
              value: {
                env: "msedge",
                userAgent:
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240",
              },
            },
          ],
        },
        {
          label: "Opera",
          options: [
            {
              label: "Opera 68",
              value: {
                env: "opera",
                userAgent:
                  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/15.0.1147.100",
              },
            },
          ],
        },
      ];

    default:
      return [];
  }
};
