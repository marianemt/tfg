import csv, numpy as np
from datetime import datetime
import random
def cr2(fich, numRandom):
    header = ['id', 'Valor', 'SensorId', 'Time']
    datos = []
    d1 = datetime.strptime("05/18/2022 11:30 AM", "%m/%d/%Y %I:%M %p")
    d2 = datetime.strptime("05/18/2022 1:00 PM", "%m/%d/%Y %I:%M %p")
    for i in range(1, numRandom + 1):
        # crear el id del fichero autonomerico 1,2,3,4...
        # crear aleatoriamente numeros del [-10,50] para los grados
        # crear rango de 20 sensores de la siguiente estructura: <ID_sensor_1> <ID_sensor_2>... 20
        muestra = (i, np.random.randint(low=0, high=101), '<ID_sensor_' + str(np.random.randint(low=1, high=11)) + '>', random_date(d1, d2))
        datos.insert(i, muestra)
    # abrir y crear fichero csv
    path = '../../data/' + fich
    with open(path, 'w', newline='') as fich:
        # escribir en el fichero
        wri = csv.writer(fich)
        # escribir el header, donde se definiran el id, valores, sensor y tiempo
        wri.writerow(header)
        # escribir dentro de cada uno la simulación de los datos aleatorios
        wri.writerows(datos)

def random_date(first_date, second_date):
    first_timestamp = int(first_date.timestamp())
    second_timestamp = int(second_date.timestamp())
    random_timestamp = random.randint(first_timestamp, second_timestamp)
    return datetime.fromtimestamp(random_timestamp)