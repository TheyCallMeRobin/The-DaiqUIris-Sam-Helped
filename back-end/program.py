import matplotlib.pyplot as plt

import mne
from mne.datasets import sample
from mne.minimum_norm import compute_source_psd_epochs, read_inverse_operator

print(__doc__)

data_path = sample.data_path()
meg_path = data_path / "MEG" / "sample"
fname_inv = meg_path / "sample_audvis-meg-oct-6-meg-inv.fif"
fname_raw = meg_path / "sample_audvis_raw.fif"
fname_event = meg_path / "sample_audvis_raw-eve.fif"
label_name = "Aud-lh"
fname_label = meg_path / "labels" / f"{label_name}.label"
subjects_dir = data_path / "subjects"

event_id, tmin, tmax = 1, -0.2, 0.5
snr = 1.0  # use smaller SNR for raw data
lambda2 = 1.0 / snr**2
method = "dSPM"  # use dSPM method (could also be MNE or sLORETA)

# Load data
inverse_operator = read_inverse_operator(fname_inv)
label = mne.read_label(fname_label)
raw = mne.io.read_raw_fif(fname_raw)
events = mne.read_events(fname_event)

# Set up pick list
include = []
raw.info["bads"] += ["EEG 053"]  # bads + 1 more

# pick MEG channels
picks = mne.pick_types(
    raw.info, meg=True, eeg=False, stim=False, eog=True, include=include, exclude="bads"
)
# Read epochs
epochs = mne.Epochs(
    raw,
    events,
    event_id,
    tmin,
    tmax,
    picks=picks,
    baseline=(None, 0),
    reject=dict(mag=4e-12, grad=4000e-13, eog=150e-6),
)

# define frequencies of interest
fmin, fmax = 0.0, 70.0
bandwidth = 4.0  # bandwidth of the windows in Hz

n_epochs_use = 10
stcs = compute_source_psd_epochs(
    epochs[:n_epochs_use],
    inverse_operator,
    lambda2=lambda2,
    method=method,
    fmin=fmin,
    fmax=fmax,
    bandwidth=bandwidth,
    label=label,
    return_generator=True,
    verbose=True,
)

# compute average PSD over the first 10 epochs
psd_avg = 0.0
for i, stc in enumerate(stcs):
    psd_avg += stc.data
psd_avg /= n_epochs_use
freqs = stc.times  # the frequencies are stored here
stc.data = psd_avg  # overwrite the last epoch's data with the average

brain = stc.plot(
    initial_time=10.0,
    hemi="both",
    views="lat",  # 10 HZ
    time_viewer=True,
    clim=dict(kind="value", lims=(20, 40, 60)),
    smoothing_steps=3,
    subjects_dir=subjects_dir,
)
brain.add_label(label, borders=True, color="k")

brain.export_html("p1.html")


print("Test")