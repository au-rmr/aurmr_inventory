#!/usr/bin/env python3

import rich_click as click
import pandas as pd
import numpy as np
from click_prompt import FilePathOption
from rich import print



@click.command()
@click.option('--csv-file', default='~/Downloads/', cls=FilePathOption)
@click.option('--output', default='/tmp/shuffled_items.csv', cls=FilePathOption)
def parse_csv(csv_file, output):
    print(f'Reading {csv_file}')
    print(f'Output will be {output}')
    bins, objects = [], []
    names = ['object', 'bin']
    df = pd.read_csv(csv_file, names = names, dtype=dict(zip(names, ['str', 'str'])))
    df = df.sample(frac=1)
    print(df.describe())

    for name, g_df in df.groupby('bin'):
        o, b = g_df.values[0]
        objects.append(o.strip())
        bins.append(b.strip())

    print(list(zip(bins, objects)))
    pd.DataFrame({'object': objects, 'bin': bins}).to_csv(output, header=False, index=False)


if __name__ == '__main__':
    parse_csv()
