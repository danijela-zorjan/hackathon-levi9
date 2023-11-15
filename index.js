
const fs = require('fs');
const csv = require('fast-csv');

const filePath = 'L9HomeworkChallengePlayersInput.csv';
const data = [];

fs.createReadStream(filePath)
  .pipe(csv.parse({ headers: true }))
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {

    let name = "Sifiso Abdalla"; 

    let single = Check(name, data);
   

    const express = require('express');
    const app = express();
    
    
    app.get('/stats/player', (req, res) => {
    
        res.send(single);   
      });
       
     
     app.use((req, res)=>{
      res.status(404)
      res.send({
        error: 'Player not found'
      });
     }) 
     
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });


  })
  .on('error', (error) => {
    console.error('Error reading CSV:', error.message);
  });


function Check(playerName, Data){
    
     let count =0;    
    let ftm=0, fta=0, twoPM=0, twoPA=0, threePM=0, threePA=0, reb=0, blk=0, ast=0, stl =0, tov =0;

    for(let i =0; i < Data.length; i++){
        if(Data[i]['PLAYER'] == playerName){
            count++;           
            
        
            ftm += Number(Data[i].FTM);
            fta += Number(Data[i].FTA);
            twoPM += Number(Data[i]['2PM']);
            twoPA += Number(Data[i]['2PA']);
            threePM += Number(Data[i]['3PM']);
            threePA += Number(Data[i]['3PA']);
            reb += Number(Data[i].REB);
            blk += Number(Data[i].BLK);
            ast += Number(Data[i].AST);
            stl += Number(Data[i].STL);
            tov += Number(Data[i].TOV);
            
        }        
    }
    
   
    let FTM = ftm/count;
    let FTA = fta/count;
    let TWOPM = twoPM/count;
    let TWOPA = twoPA/count;
    let THREEPM = threePM/count;
    let THREEPA = threePA/count;
    
    let REB = reb/count;
    let BLK = blk/count;
    let AST = ast/count;
    let STL = stl/count;
    let TOV = tov/count;
    
   
    let ftp = FTM/FTA*100;
    let twoPPercentage = TWOPM/TWOPA*100;
    let threePPercentage = THREEPM/THREEPA*100;
    let pts = FTM + 2*TWOPM + 3*THREEPM;
    
    let VAL = (FTM + 2*TWOPM + 3*THREEPM + REB + BLK + AST + STL) - (FTA-FTM + TWOPA-TWOPM + THREEPA-THREEPM + TOV);
    let eFG = (TWOPM + THREEPM + 0,5 * THREEPM) / (TWOPA + THREEPA) * 100;
    let TS = pts / (2 * (TWOPA + THREEPA + 0,475 * FTA)) * 100;
    let hAST = AST / (TWOPA + THREEPA + 0,475 * FTA + AST + TOV) * 100;

    const finalArray = {
        'playerName' : playerName,
        'gamesPlayed' : count,
         'traditional': {
             'freeThrows' :{
                 'attempts' : FTA.toFixed(1),
                 'made' : FTM.toFixed(1),
                 'shootingPercentage': ftp.toFixed(1),
             },
            'twoPoints':{
                'attempts': TWOPA.toFixed(1),
                'made' : TWOPM.toFixed(1),
                'shootingPercentage' : twoPPercentage.toFixed(1),
            },
            "threePoints": {
                "attempts": THREEPA.toFixed(1),
                "made": THREEPM.toFixed(1),
                "shootingPercentage": threePPercentage.toFixed(1),
            },


                    "points": pts.toFixed(1),
                    "rebounds": REB.toFixed(1),
                    "blocks": BLK.toFixed(1),
                    "assists": AST.toFixed(1),
                    "steals": STL.toFixed(1),
                    "turnovers": TOV.toFixed(1)
        },

         "advanced": {
            "valorization": VAL.toFixed(1),
            "effectiveFieldGoalPercentage": eFG.toFixed(1),
            "trueShootingPercentage": TS.toFixed(1),
            "hollingerAssistRatio": hAST.toFixed(1)
            }
        }
        
    return finalArray;    
}

