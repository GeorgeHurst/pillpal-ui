from werkzeug.security import generate_password_hash

##########################
passcode = '333333'
##########################


hashed_passcode = generate_password_hash(passcode)

with open('passcode.txt', 'w') as file:
    file.write(hashed_passcode)
    
print('Successfully Hashed!')