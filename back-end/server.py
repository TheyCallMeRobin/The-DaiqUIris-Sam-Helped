from flask import Flask, jsonify, request, Response
import numpy as np
import mne
import json
import os
from flask_cors import CORS, cross_origin

def init_data():
    sample_data_folder = mne.datasets.sample.data_path()
    sample_data_raw_file = (
            sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
    )
    return mne.io.read_raw_fif(sample_data_raw_file)


raw = init_data()
raw = raw.crop(0, 30).load_data()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def get_channels_from_file(file_name: str) -> list[str]:

    ext = file_name.split(".")[1]
    data = None
    channels = []
    file_name = f"files/{file_name}"
    match ext:
        case "fif":
            data = mne.io.read_raw_fif(file_name)
        case "edf":
            data = mne.io.read_raw_edf(file_name)
    channels = data.crop(0, 30).load_data().ch_names
    return channels


@app.route("/api/channels", methods=['GET'])
@cross_origin()
def get_channels():
    return raw.ch_names

@app.route("/api/channels/file/<name>", methods=["GET"])
@cross_origin()
def get_channels_from_file_endpoint(name):
    channels = []
    if (name == "Sample Data"):
        channels = raw.ch_names
    else:
        files = os.listdir("files")
        for file in files:
            if (file.startswith(name)):

                channels = get_channels_from_file(file)
                
    return jsonify(channels)

@app.route("/api/channels/<name>")
@cross_origin()
def get_channel(name):

    data, times = raw.get_data(picks=[name], return_times=True)

    exported_data = {
        'times': times.tolist(),
        'data': data.tolist()
    }

    return jsonify(exported_data)

@app.route("/api/upload", methods=["POST"])
@cross_origin()
def upload_file():
    uploaded_file = request.files['file']
    uploaded_file.save("files/" + uploaded_file.filename)
    
    return Response("Uploaded File", status=200)

@app.route("/api/files", methods=["GET"])
@cross_origin()
def get_file_names():
    
    files = os.listdir("files")
    files.insert(0, "Sample Data")

    return jsonify(files)

if __name__ == "__main__":
    app.run(debug=True)


