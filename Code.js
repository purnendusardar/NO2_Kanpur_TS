
//Define date variables
var date_1 = '2021-01-01'
var date_2 = '2021-12-31'

//Call Image Collection

var col = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
.filterBounds(KP)
.filterDate(date_1, date_2)
.select('NO2_column_number_density')
.map(function(a) {
  return a.set('month' , ee.Image(a).date().get('month'))
})

// print(col)

var months =ee.List(col.aggregate_array('month')).distinct()

//print(months)

var mc = months.map(function(x){
  return col.filterMetadata('month', 'equals', x).mean().set('month',x)
})

var final_image = ee.ImageCollection.fromImages(mc)

var chart = ui.Chart.image.series(final_image, KP, ee.Reducer.mean(),5000, 'month')
.setOptions({
  title: 'NO2 Concentration of Kanpur',
  vAxis: {title: 'Concentration'},
  hAxis: {title: 'Month'},
})

print(chart)