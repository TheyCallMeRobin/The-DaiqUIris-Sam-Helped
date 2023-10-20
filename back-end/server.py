from flask import Flask
import numpy as np
import mne
from flask_cors import CORS

def init_data():
    sample_data_folder = mne.datasets.sample.data_path()
    sample_data_raw_file = (
        sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
    )
    return mne.io.read_raw_fif(sample_data_raw_file)

data = init_data()

app = Flask(__name__)
CORS(app)

@app.route("/api/channels", methods=['GET'])
def get_channels():
    return data.ch_names

if __name__ == "__main__":
    app.run(debug=True)