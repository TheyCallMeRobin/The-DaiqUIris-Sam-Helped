import numpy as np
import mne
import pandas as pd


def init_data():
    sample_data_folder = mne.datasets.sample.data_path()
    sample_data_raw_file = (
            sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
    )
    return mne.io.read_raw_fif(sample_data_raw_file)


raw = init_data()
raw = raw.crop(0, 30).load_data().pick(["MEG 0113"])

data, times = raw[:, :]
