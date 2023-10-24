import numpy as np
import mne
from matplotlib import pyplot as plt

sample_data_folder = mne.datasets.sample.data_path()

sample_data_raw_file = (
    sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
)

raw = mne.io.read_raw_fif(sample_data_raw_file)

raw.compute_psd(fmax=50).plot(picks="data", exclude="bads")

fig = raw.plot(show=False, duration=5, n_channels=30)

plt.show()