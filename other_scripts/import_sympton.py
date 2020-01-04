import logging
import boto3
from botocore.exceptions import ClientError
from time import sleep
import json
import xlrd 
  

def main():

    client = boto3.client('dynamodb')
    tableName = 'SynonymsTable'

    wb = xlrd.open_workbook('~/synonms.xlsx') 
    sheet = wb.sheet_by_index(0) 

    # for j in range(sheet.ncols): 
    #     print((sheet.cell_value(1, j))) 

    for i in range(1, sheet.nrows-1): 
        # add session
        idStr = ''
        if (sheet.cell_value(i,0) < 10) :
            idStr = idStr + '0'
        idStr = idStr + str(int(sheet.cell_value(i,0)))

        # add type
        idStr = idStr + '0' + str(int(sheet.cell_value(i,1)))

        # add index
        idStr = idStr + '0'
        if (sheet.cell_value(i,2) < 10) :
            idStr = idStr + '0'
        idStr = idStr + str(int(sheet.cell_value(i,2)))

        if sheet.cell_value(i,1) == 4 :
            baseStr = ' '
        else :
            baseStr = sheet.cell_value(i,3)

        item_key = dict({
                'id': {
                    'S': idStr,
                },
                'session': {
                    'N': str(int(sheet.cell_value(i,0)))
                },
                'A': {
                    'S': sheet.cell_value(i,4)
                },
                'B': {
                    'S': sheet.cell_value(i,5)
                },
                'C': {
                    'S': sheet.cell_value(i,6)
                },
                'D': {
                    'S': sheet.cell_value(i,7)
                },
                'E': {
                    'S': sheet.cell_value(i,8)
                },
                'base': {
                    'S': baseStr
                },
                'Hint': {
                    'S': sheet.cell_value(i,10)
                },
                'Answer': {
                    'S': sheet.cell_value(i, 4 + ord(sheet.cell_value(i,9))- ord('A'))
                },
                'type': {
                    'S': str(int(sheet.cell_value(i,1)))
                },
                'index': {
                    'N': str(int(sheet.cell_value(i,2)))
                }
            })

        response = client.put_item(
            TableName=tableName,
            Item=item_key,
        )
    
        # print (response)

if __name__ == '__main__':
    main()
