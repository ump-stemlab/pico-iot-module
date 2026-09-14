# ---------------------------------------------------------------------------
# urequests.py  --  a very small HTTP client for MicroPython
# UMPSA STEM LAB  *  See . Think . Explore . Marvel
#
# Wokwi has no package manager, so a library arrives as an ordinary project
# file -- the same way ssd1306.py did in Activity 7 and umqtt_simple.py did in
# Activity 11. Add this to the project as a new file called  urequests.py
# and then never think about it again.
#
# This is the micropython-lib "requests" module (MIT licence), trimmed to the
# two things Activity 13 needs: post() and get().
# ---------------------------------------------------------------------------

import socket


class Response:
    def __init__(self, f):
        self.raw = f
        self.encoding = "utf-8"
        self._cached = None
        self.status_code = None
        self.reason = ""

    def close(self):
        if self.raw:
            self.raw.close()
            self.raw = None
        self._cached = None

    @property
    def content(self):
        if self._cached is None:
            try:
                self._cached = self.raw.read()
            finally:
                self.raw.close()
                self.raw = None
        return self._cached

    @property
    def text(self):
        return str(self.content, self.encoding)

    def json(self):
        import json as _json
        return _json.loads(self.content)


def request(method, url, data=None, json=None, headers=None,
            timeout=None, allow_redirects=True):

    if headers is None:
        headers = {}

    redirect = None

    # ---- pull the address apart -------------------------------------------
    try:
        proto, _dummy, host, path = url.split("/", 3)
    except ValueError:
        proto, _dummy, host = url.split("/", 2)
        path = ""

    if proto == "http:":
        port = 80
    elif proto == "https:":
        port = 443
    else:
        raise ValueError("Unsupported protocol: " + proto)

    if ":" in host:
        host, port = host.split(":", 1)
        port = int(port)

    # ---- turn a dictionary into a JSON body -------------------------------
    if json is not None:
        import json as _json
        data = _json.dumps(json)
        headers["Content-Type"] = "application/json"

    if data is not None and isinstance(data, str):
        data = data.encode()

    # ---- connect ----------------------------------------------------------
    ai = socket.getaddrinfo(host, port, 0, socket.SOCK_STREAM)[0]
    s = socket.socket(ai[0], ai[1], ai[2])

    if timeout is not None:
        s.settimeout(timeout)

    try:
        s.connect(ai[-1])

        if proto == "https:":
            import ssl
            s = ssl.wrap_socket(s, server_hostname=host)

        s.write(b"%s /%s HTTP/1.0\r\n" % (method, path))
        s.write(b"Host: %s\r\n" % host)

        for k in headers:
            s.write(k)
            s.write(b": ")
            s.write(headers[k])
            s.write(b"\r\n")

        if data is not None:
            s.write(b"Content-Length: %d\r\n" % len(data))

        s.write(b"\r\n")

        if data is not None:
            s.write(data)

        # ---- the first line of the reply: HTTP/1.0 200 OK -----------------
        line = s.readline()
        line = line.split(None, 2)
        status = int(line[1])
        reason = ""
        if len(line) > 2:
            reason = line[2].rstrip()

        # ---- the headers, which we only read to find a redirect -----------
        while True:
            line = s.readline()
            if not line or line == b"\r\n":
                break
            if line.startswith(b"Location:") and 300 <= status <= 399:
                redirect = str(line[9:].strip(), "utf-8")

    except OSError:
        s.close()
        raise

    # ---- Google answers a POST with "go and look over there" --------------
    if redirect and allow_redirects:
        s.close()
        if status in (301, 302, 303):
            return request("GET", redirect, None, None, {}, timeout, True)
        return request(method, redirect, data, None, headers, timeout, True)

    response = Response(s)
    response.status_code = status
    response.reason = reason
    return response


def get(url, **kw):
    return request("GET", url, **kw)


def post(url, **kw):
    return request("POST", url, **kw)
