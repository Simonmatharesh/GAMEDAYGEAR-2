import google.generativeai as genai

genai.configure(api_key="AIzaSyDXL4Gq-Dyu72FphH4VuC10mGk9GLWWGRg")

models = genai.list_models()
for model in models:
    print(model.name, "->", model.supported_generation_methods)
