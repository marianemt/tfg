import csv, numpy as np
from datetime import datetime
def cr2(fich, numRandom):
    #aquí se generan las columnas del .csv
    header = ['idMuestra', 'Grados', 'SensorMedia', 'Time']
    datos = []

    for i in range(1, numRandom + 1):
        # crear aleatoriamente numeros del [-10,50] para los grados
        # crear rango de 20 sensores de la siguiente estructura: <ID_sensor_1> <ID_sensor_2>... 20
        muestra = (i,np.random.randint(low=-10, high=51) ,'<ID_sensor_' + str(np.random.randint(low=1, high=11)) + '>', datetime.now())
        datos.insert(i, muestra)
    #abrir y crear fichero csv
    with open(fich, 'w', newline='') as fich:
    #escribir en el fichero
        wri = csv.writer(fich)
    #escribir el header, donde se definiran el id, grados y sensor
        wri.writerow(header)
    #escribir dentro de cada uno la simulación de los datos aleatorios
        wri.writerows(datos)