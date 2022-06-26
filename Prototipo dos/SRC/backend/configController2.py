from configparser import ConfigParser
import createMov, createHum

parser = ConfigParser()
parser.read('../../config/config2.ini')

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
        if d == 'movimientos':
            # entonces que coja el fichero de precipitacion
            print('estoy dentro1')
            fich = parser.get('FICH', 'movfichero')
            print(fich)
            createMov.cr1(fich, value)

        if d == 'humedades':
            # entonces que coja el fichero de temperatura
            print('estoy dentro2')
            fich = parser.get('FICH', 'humefichero')
            print(fich)
            createHum.cr2(fich, value)
