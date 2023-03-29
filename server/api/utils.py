from math import isnan

# Pitch smoother
def smoother(pitch, threshold1, threshold2):
    new_pitch = pitch.copy()
    for i in range(1, len(new_pitch)-2):
        # Handle beginning and end of pitch
        if new_pitch[i + 1] or new_pitch[i - 1]:
            continue
                
        if abs(new_pitch[i] - new_pitch[i - 1]) < threshold1 and abs(new_pitch[i] - new_pitch[i + 1]) < threshold1:
            continue
        elif abs(new_pitch[i] * 2 - new_pitch[i - 1]) < threshold2:
            new_pitch[i] = new_pitch[i] * 2
        elif abs(new_pitch[i] / 2 - new_pitch[i - 1]) < threshold2:
            new_pitch[i] = new_pitch[i] / 2
        elif abs(new_pitch[i] / 3 - new_pitch[i - 1]) < threshold2:
            new_pitch[i] = new_pitch[i] / 3
        elif abs(new_pitch[i] - new_pitch[i - 1]) > threshold1 and abs(new_pitch[i] - new_pitch[i + 1]) > threshold1:
            new_pitch[i] = 0.5 * (new_pitch[i + 1] + new_pitch[i - 1])
        else:
            pitch[i] = pitch[i - 1] + pitch[i + 1] - pitch[i]
    return new_pitch

# Pitch validation
def validate(pitch_list, periodicity_list, threshold1, threshold2):
    valid_pitch = []
    start = None
    end = None
    for i, periodicity in enumerate(periodicity_list):
        if periodicity > threshold1:
            if start == None:
                start = i
            end = i
        else:
            if start is not None and end - start > threshold2:
                valid_pitch.extend(pitch_list[start: end + 1])
            elif start is not None:
                valid_pitch.extend([0] * (end - start + 1))
            start = None
            end = None
    if not valid_pitch:
        valid_pitch = pitch_list
    return valid_pitch