import plotly
import plotly.plotly as pt
import plotly.figure_factory as myfig
import pandas as pd

details = pd.read_csv("Assets/data.csv")

diagram = myfig.create_gantt(details)


pt.iplot(diagram, filename='gantt-simple-gantt-chart', world_readable=True)
