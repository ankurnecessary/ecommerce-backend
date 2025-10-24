import fs from 'node:fs';
import yaml from 'yaml';
import openAPI from './openAPI-config';

const yamlSpec = yaml.stringify(openAPI);
fs.writeFileSync('./openapi.yaml', yamlSpec, 'utf8');
