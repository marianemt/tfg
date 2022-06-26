from configparser import ConfigParser
import createTemp, createVien, createPrecip

parser = ConfigParser()
parser.read('../../config/config.ini')

print('\nBooleans:')
for name in parser.options('BOOL'):
    string_value = parser.get('BOOL', name)
    value = parser.getboolean('BOOL', name)
    print('  {:<12} : {!r:<7} -> {}'.format(
        name, string_value, value))

for d in parser.options('BOOL'):
    for num in parser.options('NUMERO'):
        # coger este value para saber el numero de cosas random que tengo que crear
        value = parser.getint('NUMERO', num)
    if parser.getboolean('BOOL', d):
        if d == 'precipitacion':
            # entonces que coja el fichero de precipitacion
            print('estoy dentro1')
            fich = parser.get('FICH', 'precipfichero')
            print(fich)
            createPrecip.cr1(fich, value)

        if d == 'temperatura':
            # entonces que coja el fichero de temperatura
            print('estoy dentro2')
            fich = parser.get('FICH', 'tempfichero')
            print(fich)
            createTemp.cr2(fich, value)
        if d == 'viento':
            # entonces coge el fichero de viento
            print('estoy dentro3')
            fich = parser.get('FICH', 'vienfichero')
            print(fich)
            createVien.cr3(fich, value)