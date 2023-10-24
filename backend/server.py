from flask import Flask, jsonify
import numpy as np
import mne
import json
from flask_cors import CORS

def init_data():
    sample_data_folder = mne.datasets.sample.data_path()
    sample_data_raw_file = (
            sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
    )
    return mne.io.read_raw_fif(sample_data_raw_file)


raw = init_data()
raw = raw.crop(0, 30).load_data()

app = Flask(__name__)
CORS(app)


@app.route("/api/channels", methods=['GET'])
def get_channels():
    return raw.ch_names


@app.route("/api/channels/<name>")
def get_channel(name):

    data, times = raw.get_data(picks=[name], return_times=True)

    exported_data = {
        'times': times.tolist(),
        'data': data.tolist()
    }

    return jsonify(exported_data)


if __name__ == "__main__":
    app.run(debug=True)
