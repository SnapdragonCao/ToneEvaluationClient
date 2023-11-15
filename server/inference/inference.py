from utils import read_json, process_mp3
from Model import SiameseModel
from torch import nn
import torch
import argparse

def find_dist(ref_embeds, embeds):
    embeds = embeds.squeeze()
    ref_embeds = ref_embeds.squeeze()
    cos = nn.CosineSimilarity(dim=0)
    return cos(embeds, ref_embeds)


def decode_one_hot(preds, mappings):
    preds = preds.squeeze()
    _, idx = torch.max(preds, 0)
    return mappings[int(idx)]

def inference(user_input, reference, config):
    ref_mp3 = process_mp3(reference)
    ref_mp3 = ref_mp3.unsqueeze(0)
    user_mp3 = process_mp3(user_input, trim=True)
    user_mp3 = user_mp3.unsqueeze(0)

    swap_key_values = lambda mappings: dict(zip(mappings.values(), mappings.keys()))
    pinyins_dict = swap_key_values(read_json(f"{config['csv_folder']}/pinyins.json"))
    tones_dict = swap_key_values(read_json(f"{config['csv_folder']}/tones.json"))

    siamese_model = f"{config['models_folder']}/{config['siamese_model_name']}"
    pretrained_model = f"{config['models_folder']}/{config['pretrained_model_name']}"

    model = SiameseModel(pretrained_model, len(tones_dict), len(pinyins_dict), config["device"])
    weights = torch.load(siamese_model, map_location=config["device"], weights_only=True)
    model.load_state_dict(weights)

    model.eval()
    with torch.no_grad():
        pred_embeds, ref_embeds, pinyin_tone = model(user_mp3, ref_mp3)

    dist = find_dist(pred_embeds, ref_embeds)
    pinyin_preds, tone_preds = pinyin_tone

    tone = decode_one_hot(tone_preds, tones_dict)
    pinyin = decode_one_hot(pinyin_preds, pinyins_dict)

    return pinyin, tone, round(dist.item(), 4)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--config", default="./config.json")
    parser.add_argument("-r", "--reference")
    parser.add_argument("-i", "--user_input")
    args = parser.parse_args()

    config = read_json(args.config)
    ref_mp3 = process_mp3(args.reference)
    ref_mp3 = ref_mp3.unsqueeze(0)
    user_mp3 = process_mp3(args.user_input, trim=True)
    user_mp3 = user_mp3.unsqueeze(0)

    swap_key_values = lambda mappings: dict(zip(mappings.values(), mappings.keys()))
    pinyins_dict = swap_key_values(read_json(f"{config['csv_folder']}/pinyins.json"))
    tones_dict = swap_key_values(read_json(f"{config['csv_folder']}/tones.json"))

    siamese_model = f"{config['models_folder']}/{config['siamese_model_name']}"
    pretrained_model = f"{config['models_folder']}/{config['pretrained_model_name']}"

    model = SiameseModel(pretrained_model, len(tones_dict), len(pinyins_dict), config["device"])
    weights = torch.load(siamese_model, map_location=config["device"], weights_only=True)
    model.load_state_dict(weights)

    model.eval()
    with torch.no_grad():
        pred_embeds, ref_embeds, pinyin_tone = model(user_mp3, ref_mp3)

    dist = find_dist(pred_embeds, ref_embeds)
    pinyin_preds, tone_preds = pinyin_tone

    tone = decode_one_hot(tone_preds, tones_dict)
    pinyin = decode_one_hot(pinyin_preds, pinyins_dict)

    print("---")
    print(f"Pinyin Prediction: {pinyin}")
    print(f"Tone Prediction  : {tone}")
    print(f"Similarity Score : {round(dist.item(), 4)}")
