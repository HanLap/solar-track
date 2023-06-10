from fastapi import FastAPI
from src.solarmax import SolarMax
from pydantic import BaseModel
from typing import List
from datetime import date

app = FastAPI()

class Measurement(BaseModel):
	addr: int
	pac: float
	pdc: float
	kdy: float
	kt0: float
	fdat: date

@app.get("/measurement")
async def root():

    inverters = { '192.168.178.123': [9, 10], }
    
    smlist = []
    for host in inverters.keys():
        sm = SolarMax(host, 12345)
        sm.use_inverters(inverters[host])
        smlist.append(sm)
    
    
    allinverters = []
    for host in inverters.keys():
        allinverters.extend(inverters[host])

    inverters = []
    for (no, ivdata) in sm.inverters().items():
        try:
            (inverter, current) = sm.query(no, ['PAC', 'KDY', 'KT0', 'IDC', 'UDC', 'IL1', 'UL1', 'FDAT', 'SYS'])
        except Exception as e:
            # Kommunikationsfehler, evtl. Wechselrichter aus
            print(f'Kommunikationsfehler, WR {no}, {e}')
            continue
        
        ivmax = ivdata['installed']
        PAC = current['IL1'] * current['UL1']
        percent = int((PAC/ivmax) * 100)
        PDC = current['IDC'] * current['UDC']
        (status, errors) = sm.status(no)
        
        if errors:
            print(f'WR {no}: {status} ({errors})')

        print('here')

        inverters.append(Measurement(
            addr=inverter, 
            pac=PAC, 
            pdc=PDC,
            kdy=current['KDY'],
            kt0=current['KT0'],
            fdat=current['FDAT'].date()
        ))
      
    return inverters


class Inverter(BaseModel):
    addr: int
    ivname: str
    ivmax: float


@app.get("/inverters")
async def get_inverters():

    inverters = { '192.168.178.123': [9, 10], }
    
    smlist = []
    for host in inverters.keys():
        sm = SolarMax(host, 12345)
        sm.use_inverters(inverters[host])
        smlist.append(sm)
    
    
    allinverters = []
    for host in inverters.keys():
        allinverters.extend(inverters[host])

    inverters = []
    for (no, ivdata) in sm.inverters().items():
        inverters.append(Inverter(addr=no, ivname=ivdata['desc'], ivmax=ivdata['installed']))
        
    return inverters