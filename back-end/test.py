import mne
import os
import unittest

class TestingPlayground(unittest.TestCase):


    sample_data_folder = mne.datasets.sample.data_path()
    sample_data_raw_file = (
        sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
    )
    raw = mne.io.read_raw_fif(sample_data_raw_file)

    files = os.listdir("back-end/files")

    filtered = list(filter(lambda file: file.find(".edf") == -1, files))
    print(filtered)
