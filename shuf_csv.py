#!/usr/bin/env python3

import rich_click as click
from click_prompt import FilePathOption
from rich import print

import pandas as pd


@click.command()
@click.option('--csv-file', default='~/Downloads/', cls=FilePathOption)
@click.option('--output', default='/tmp/shuffled_items.csv', cls=FilePathOption)
def parse_csv(csv_file, output):
    print(f'Reading {csv_file}')
    print(f'Output will be {output}')
    names = ['object', 'bin', 'description']
    df = pd.read_csv(csv_file, names = names, dtype=dict(zip(names, ['str', 'str', 'str'])))
    print(df.describe())

    df = df.groupby('bin').sample(n=1)
    #df = df.groupby('bin').sample(frac=1)
    #df = df.sample(frac=1)

    df.to_csv(output, header=False, index=False)




if __name__ == '__main__':
    parse_csv()
