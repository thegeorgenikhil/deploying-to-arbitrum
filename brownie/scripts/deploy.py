from brownie import MyToken, accounts

def main():
    account = accounts.load('main')
    MyToken.deploy({'from': account},publish_source=True)
