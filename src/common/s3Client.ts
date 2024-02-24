import { S3Client } from '@aws-sdk/client-s3'

const REGION = 'ru-central1'
export const S3BUCKET = 's3media'
export const S3ENDPOINT = 'https://storage.yandexcloud.net'
export const s3Client = new S3Client({ region: REGION, endpoint: S3ENDPOINT })
