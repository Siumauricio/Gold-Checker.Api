# Gold-Checker.Api

## Basic application to fetch gold value history and get the lowest and highest value taking the current day to the past 5 years

### To run set the following commands in the /Golden-Checker directory 

```
Build
docker build -t gold-rate .

Format YYYY-MM-DD
DATE = 2022-05-12
docker run  gold-rate 2022-05-12
docker run  gold-rate 2020-01-11
```
