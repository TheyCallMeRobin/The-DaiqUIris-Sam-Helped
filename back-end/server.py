from http import HTTPStatus
from flask import Flask, jsonify, request, Response
import numpy as np
import mne
import json
import os
import mpld3
from flask_cors import CORS, cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

def init_data():
    sample_data_folder = mne.datasets.sample.data_path()
    sample_data_raw_file = (
            sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
    )
    return mne.io.read_raw_fif(sample_data_raw_file)


raw = init_data()
raw = raw.crop(0, 30).load_data()


app = Flask(__name__)
limiter = Limiter(key_func=get_remote_address, app=app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


def get_edf_data(data):
    print(data.times)
    df = data.describe(True)
    
    out = df.to_json(orient='records')
    data.plot()
    #return json.loads(out)

def get_channels_from_file(file_name: str) -> list[str]:

    ext = file_name.split(".")[1]
    data = None
    channels = []
    file_name = f"files/{file_name}"
    match ext:
        case "fif":
            data = mne.io.read_raw_fif(file_name)
        case "edf":
            data = mne.io.read_raw_edf(file_name, preload=True)
            # return get_edf_data(data)
    if (data != None):
        global raw
        raw = data

    channels = data.crop(0, 30).load_data().ch_names
    return channels



def get_channel_data(name):
    print("CHANNELS:", raw.info.ch_names)
    data, times = raw.get_data(picks=[name], return_times=True)

    exported_data = {
        'times': times.tolist(),
        'data': data.tolist()
    }
    return exported_data

def get_all_channels() -> list[str]:
    return raw.ch_names

@app.route("/api/channels", methods=['GET'])
@cross_origin()
def get_channels():
    data = get_all_channels()
    return jsonify(data)

@app.route("/api/channels/file/<name>", methods=["GET"])
@cross_origin()
def get_channels_from_file_endpoint(name):
    channels = []
    if (name == "Sample Data"):
        global raw
        raw = init_data()
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
    data = get_channel_data(name)
    return jsonify(data)


@app.route("/api/channels/data/<name>", methods=["GET"])
@cross_origin()
def get_channel_data_from_file(name):
    channels = []
    data = [[]]


    if (name == "Sample Data"):
        channels = get_all_channels()
    else:
        channels = get_channels_from_file(name)

    for i in range(10):
        channel_data = get_channel_data(channels[i])
        data.append(channel_data)
    return jsonify(data)



@app.route("/api/upload", methods=["POST"])
@cross_origin()
def upload_file():
    try:
        uploaded_file = request.files['file']
        uploaded_file.save("files/" + uploaded_file.filename)
    
        return Response("Uploaded File", status=201)
    except:
        return Response("Unable to upload file", sstatus=400)

@app.route("/api/files", methods=["GET"])
@cross_origin()
def get_file_names():
    
    files = os.listdir("files")
    files.insert(0, "Sample Data")

    return jsonify(files)

@app.route("/api/psd", methods=["GET"])
@cross_origin()
def get_psd():
    raw.load_data()
    figure = raw.compute_psd(fmax=50).plot(picks="data", exclude="bads", sphere="auto", show=False)

    html_str = mpld3.fig_to_html(figure, template_type="general")

    return html_str

@app.route("/api/raw-sensor", methods=["GET"])
@cross_origin()
def get_raw_sensors():

    raw.load_data()
    figure = raw.plot(duration=5, n_channels=30, show=False)

    html_str = mpld3.fig_to_html(figure, template_type="general")

    return html_str

@app.route("/api/sensors", methods=["GET"])
@cross_origin()
@limiter.limit("2/second")
def get_sensors():
    figure = raw.plot_sensors(ch_type="eeg", show=False)
    html_str = mpld3.fig_to_html(figure, template_type="general")

    return html_str

@app.route("/api/stc", methods=["GET"])
@cross_origin()
def get_stc():

    raw = init_data()
    raw = raw.crop(0, 30).load_data()

    sample_data_folder = mne.datasets.sample.data_path()

    ica = mne.preprocessing.ICA(n_components=20, random_state=97, max_iter=800)
    ica.fit(raw)
    ica.exclude = [1, 2] 
    orig_raw = raw.copy()
    raw.load_data()
    ica.apply(raw)

    chs = [
        "MEG 0111",
        "MEG 0121",
        "MEG 0131",
        "MEG 0211",
        "MEG 0221",
        "MEG 0231",
        "MEG 0311",
        "MEG 0321",
        "MEG 0331",
        "MEG 1511",
        "MEG 1521",
        "MEG 1531",
        "EEG 001",
        "EEG 002",
        "EEG 003",
        "EEG 004",
        "EEG 005",
        "EEG 006",
        "EEG 007",
        "EEG 008",
    ]
    chan_idxs = [raw.ch_names.index(ch) for ch in chs]
    orig_raw.plot(order=chan_idxs, start=12, duration=4)
    events = mne.find_events(raw, stim_channel="STI 014")
    event_dict = {
        "auditory/left": 1,
        "auditory/right": 2,
        "visual/left": 3,
        "visual/right": 4,
        "smiley": 5,
        "buttonpress": 32,
    }
    reject_criteria = dict(
        mag=4000e-15,  # 4000 fT
        grad=4000e-13,  # 4000 fT/cm
        eeg=150e-6,  # 150 µV
        eog=250e-6,
    )  # 250 µV
    epochs = mne.Epochs(
        raw,
        events,
        event_id=event_dict,
        tmin=-0.2,
        tmax=0.5,
        reject=reject_criteria,
        preload=True,
    )
    conds_we_care_about = ["auditory/left", "auditory/right", "visual/left", "visual/right"]
    epochs.equalize_event_counts(conds_we_care_about)  

    vis_epochs = epochs["visual"]
    del raw, epochs  

    vis_evoked = vis_epochs.average()

    inverse_operator_file = (
        sample_data_folder / "MEG" / "sample" / "sample_audvis-meg-oct-6-meg-inv.fif"
    )

    inv_operator = mne.minimum_norm.read_inverse_operator(inverse_operator_file)
    snr = 3.0
    lambda2 = 1.0 / snr**2
    stc = mne.minimum_norm.apply_inverse(vis_evoked, inv_operator, lambda2=lambda2, method="MNE")  

    subjects_dir = sample_data_folder / "subjects"

    figure = stc.plot(initial_time=0.1, hemi="split", views=["lat", "med"], subjects_dir=subjects_dir)

    return mpld3.fig_to_html(figure, template_type="general")


if __name__ == "__main__":
    app.run(debug=True)