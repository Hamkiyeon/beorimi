FROM python:3.11-slim

WORKDIR /app

# torch/torchvision CPU 버전 (HF Spaces는 CPU 환경)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# HuggingFace Model Hub에서 모델 다운로드
RUN python -c "\
from huggingface_hub import snapshot_download; \
snapshot_download(repo_id='luculentus/beorimi-waste-classifier', repo_type='model', local_dir='./my_permanent_model'); \
print('Model downloaded successfully')"

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
