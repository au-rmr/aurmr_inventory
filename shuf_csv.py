#!/usr/bin/env python3

import rich_click as click
from click_prompt import filepath_option
from rich import print

import pandas as pd


@click.command()
@filepath_option('--csv-file', default='~/Downloads/')
@filepath_option('--output', default='~/Downloads/shuffled_items.csv')
@click.option('--num-items', default=1,  prompt='Number of items to select in each bin.')
def parse_csv(csv_file, output, num_items):
    print(f'Reading {csv_file}')
    print(f'Output will be {output}')
    print(f'Selecting {num_items} out of each bin')
    names = ['object', 'bin', 'description']
    df = pd.read_csv(csv_file, names = names, usecols=[0, 1, 2], dtype=dict(zip(names, ['str', 'str', 'str'])))
    print(df.describe())

    if num_items > 0:
        df = df.groupby('bin').sample(n=1)
    else:
        print('Selecting all items in each bin')
    #df = df.groupby('bin').sample(frac=1)

    df = df.sample(frac=1)

    df.to_csv(output, header=False, index=False)




if __name__ == '__main__':
    parse_csv()
