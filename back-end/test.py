import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import mpld3
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request, Response
import mne
sample_data_folder = mne.datasets.sample.data_path()
sample_data_raw_file = (
    sample_data_folder / "MEG" / "sample" / "sample_audvis_filt-0-40_raw.fif"
)
raw = mne.io.read_raw_fif(sample_data_raw_file)

figure = raw.compute_psd(fmax=50).plot(picks="data", exclude="bads", sphere="auto", show = False)

#figure = raw.plot(duration=5, n_channels=30, show = False)

html_str = mpld3.fig_to_html(figure, template_type="general")
Html_file= open("index.html","w")
Html_file.write(html_str)
Html_file.close()
