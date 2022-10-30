import pathlib
serial_number = 0
for path in pathlib.Path("../resources/hebrew_letter_class/0").iterdir():
    if path.is_file():
        serial_number += 1

print(serial_number)