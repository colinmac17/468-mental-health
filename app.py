from flask import Flask, send_from_directory, redirect
import csv

app = Flask(__name__)

# Get Data for Prevalence
prevalence_reader = csv.reader(open("data/prevalence_mental-health_disorders.csv"))
prevalence_header = prevalence_reader.__next__()
prevalence_string_data = [ row for row in prevalence_reader ]

# take a list of data rows and make CSV text
def dataToCSVStr(header, dataList):
    csvStr = ",".join(header) + "\n"
    strData = [ ",".join([str(x) for x in data])
                  for data in dataList ]
    csvStr += "\n".join(strData)

    return csvStr

# Redirects from index route to our index.html
@app.route('/')
def index():
    return redirect("/index.html", code=302)

# Lets us catch any file and serve it
# We use this to serve our index.html
@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)

# Converts our prevalence csv data into a readable string
# We can follow this pattern for other data sets we need to fetch
@app.route('/csv/prevalence')
def get_data():
    return dataToCSVStr(prevalence_header, prevalence_string_data)