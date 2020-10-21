from fabric.api import local, env, cd, sudo
env.hosts = ['ctadmin@38.72.121.205']
# The user account that owns the application files and folders.
owner = 'ctadmin'
app_name = 'gridServer'
app_directory = '/home/ctadmin/codebase/grid-server-django/'
settings_file = 'settings'
def deploy():
    """
    Deploy the app to the remote host.
    Steps:
        1. Change to the app's directory.
        2. Pull changes from master branch in git.
        3. Activate virtualenv.
        4. Run pip install using the requirements.txt file.
        5. Run South migrations.
        6. Restart gunicorn WSGI server using supervisor.
    """
    with cd(app_directory):
        sudo('git pull', user=owner)
        venv_command = 'source ../bin/activate'
        pip_command = 'pip install -r requirements.txt'
        sudo('%s && %s' % (venv_command, pip_command), user=owner)
        south_command = 'python gridServer/manage.py migrate --all ' \
                        '--settings=%s' % settings_file
        sudo('%s && %s' % (venv_command, south_command), user=owner)
        sudo('supervisorctl restart gridServer')